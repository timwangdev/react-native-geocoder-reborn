#import "RNGeocoder.h"

#import <CoreLocation/CoreLocation.h>

#import <React/RCTConvert.h>

@implementation RCTConvert (CoreLocation)

+ (CLLocation *)CLLocation:(id)json
{
    json = [self NSDictionary:json];

    double lat = [RCTConvert double:json[@"lat"]];
    double lng = [RCTConvert double:json[@"lng"]];
    return [[CLLocation alloc] initWithLatitude:lat longitude:lng];
}

@end

@implementation RNGeocoder

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(init:(NSString *)locale
                  maxResults:(NSInteger *) maxResults)
{
    self.geocoder = [[CLGeocoder alloc] init];
    self.locale = [NSLocale localeWithLocaleIdentifier:locale];
    self.maxResults = maxResults;
}

RCT_EXPORT_METHOD(geocodePosition:(CLLocation *)location
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (self.geocoder.geocoding) {
        [self.geocoder cancelGeocode];
    }

    CLGeocodeCompletionHandler handler = ^void(NSArray< CLPlacemark *> *placemarks, NSError *error) {
        if (error) {
            if (placemarks.count == 0) {
                return reject(@"EMPTY_RESULT", @"Geocoder returned an empty list.", error);
            }

            return reject(@"NATIVE_ERROR", @"reverseGeocodeLocation failed.", error);
        }
        resolve([self placemarksToDictionary:placemarks]);
    };

    if (@available(iOS 11.0, *)) {
        [self.geocoder reverseGeocodeLocation:location
                              preferredLocale:self.locale
                            completionHandler:handler];
    } else {
        [self.geocoder reverseGeocodeLocation:location completionHandler:handler];
    }
}

RCT_EXPORT_METHOD(geocodeAddress:(NSString *)address
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (self.geocoder.geocoding) {
      [self.geocoder cancelGeocode];
    }

    CLGeocodeCompletionHandler handler = ^void(NSArray< CLPlacemark *> *placemarks, NSError *error) {
        if (error) {
            if (placemarks.count == 0) {
              return reject(@"NOT_FOUND", @"Geocoder returned an empty list.", error);
            }
            return reject(@"NATIVE_ERROR", @"geocodeAddressString failed.", error);
        }
        resolve([self placemarksToDictionary:placemarks]);
    };

    if (@available(iOS 11.0, *)) {
        [self.geocoder geocodeAddressString:address inRegion:nil preferredLocale:self.locale  completionHandler:handler];
    } else {
        [self.geocoder geocodeAddressString:address completionHandler:handler];
    }
}

RCT_EXPORT_METHOD(geocodeAddressWithBounds:(NSString *)address
                  swLat:(CGFloat)swLat
                  swLng:(CGFloat)swLng
                  neLat:(CGFloat)neLat
                  neLng:(CGFloat)neLng
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    if (self.geocoder.geocoding) {
      [self.geocoder cancelGeocode];
    }

    CLRegion* region;
    if (swLat == 0 || swLng == 0 || neLat == 0 || neLng == 0){
        region = nil;
    } else {
        CLLocationCoordinate2D center = CLLocationCoordinate2DMake(swLat + (neLat-swLat) / 2, swLng + (neLng-swLng) / 2);
        //Computing the radius based on lat delta, since 1 lat ~= 111 km no matter the location
        float latDelta = neLat - swLat;
        float radiusLat = (latDelta/2);
        float radius = radiusLat * 111000;
        region = [[CLCircularRegion alloc] initWithCenter:center radius:radius identifier:@"Search Radius"];
    }

    CLGeocodeCompletionHandler handler = ^void(NSArray< CLPlacemark *> *placemarks, NSError *error) {
        if (error) {
            if (placemarks.count == 0) {
              return reject(@"NOT_FOUND", @"Geocoder returned an empty list.", error);
            }
            return reject(@"NATIVE_ERROR", @"geocodeAddressString failed.", error);
        }
        resolve([self placemarksToDictionary:placemarks]);
    };

    if (@available(iOS 11.0, *)) {
        [self.geocoder geocodeAddressString:address inRegion:region preferredLocale:self.locale completionHandler:handler];
    } else {
        [self.geocoder geocodeAddressString:address completionHandler:handler];
    }
}

- (NSArray *)placemarksToDictionary:(NSArray *)placemarks {

    NSMutableArray *results = [[NSMutableArray alloc] init];

    for (int i = 0; i < placemarks.count; i++) {
        CLPlacemark* placemark = [placemarks objectAtIndex:i];

        NSString *name = nil;

        if (![placemark.name isEqualToString:placemark.locality] &&
            ![placemark.name isEqualToString:placemark.thoroughfare] &&
            ![placemark.name isEqualToString:placemark.subThoroughfare])
        {
            name = placemark.name;
        }

        NSArray *lines = placemark.addressDictionary[@"FormattedAddressLines"];

        NSDictionary *result = @{
            @"feature": name ?: [NSNull null],
            @"position": @{
                 @"lat": [NSNumber numberWithDouble:placemark.location.coordinate.latitude],
                 @"lng": [NSNumber numberWithDouble:placemark.location.coordinate.longitude],
                 },
            @"country": placemark.country ?: [NSNull null],
            @"countryCode": placemark.ISOcountryCode ?: [NSNull null],
            @"locality": placemark.locality ?: [NSNull null],
            @"subLocality": placemark.subLocality ?: [NSNull null],
            @"streetName": placemark.thoroughfare ?: [NSNull null],
            @"streetNumber": placemark.subThoroughfare ?: [NSNull null],
            @"postalCode": placemark.postalCode ?: [NSNull null],
            @"adminArea": placemark.administrativeArea ?: [NSNull null],
            @"subAdminArea": placemark.subAdministrativeArea ?: [NSNull null],
            @"formattedAddress": [lines componentsJoinedByString:@", "] ?: [NSNull null]
        };

        [results addObject:result];
    }

    return results;

}

@end
