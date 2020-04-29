import geocoder from '../geocoder';
import nativeImpl from '../native';
import googleApi from '../googleApi';

jest.mock('../native', () => ({
  init: jest.fn(),
  geocodePosition: jest.fn(),
  geocodeAddress: jest.fn(),
  geocodeAddressWithBounds: jest.fn(),
}));

jest.mock('../googleApi', () => ({
  geocodePosition: jest.fn(),
  geocodeAddress: jest.fn(),
  geocodeAddressWithBounds: jest.fn(),
}));

describe('geocode position', () => {
  it('should throw if position is invalid', async () => {
    // @ts-ignore: Expect to throw
    await expect(geocoder.geocodePosition({})).rejects.toThrowError();
  });

  it('should call native function with position', async () => {
    let position = { lat: -1.2, lng: 3.4 };
    await geocoder.geocodePosition(position);
    expect(nativeImpl.geocodePosition).toMatchSnapshot();
  });

  it('should throw if native function rejects and fallbackToGoogle is not set', async () => {
    nativeImpl.geocodePosition = () => Promise.reject(new Error('NO IMPL'));
    let position = { lat: -1.2, lng: 3.4 };
    await expect(geocoder.geocodePosition(position)).rejects.toThrowError();
  });

  it('should call googleApi function with position if fallbackToGoogle is set and native fails', async () => {
    nativeImpl.geocodePosition = () => Promise.reject(new Error('NO IMPL'));
    let position = { lat: -1.2, lng: 3.4 };
    let options = {
      fallbackToGoogle: true,
      apiKey: 'TEST',
      locale: 'de',
    };
    await geocoder.geocodePosition(position, options);
    expect(googleApi.geocodePosition).toMatchSnapshot();
  });
});

describe('geocode address', () => {
  it('should throw if address is invalid', async () => {
    expect(geocoder.geocodeAddress('')).rejects.toThrowError();
  });

  it('should throw if native function rejects and fallbackToGoogle is not set', async () => {
    nativeImpl.geocodeAddress = () => Promise.reject(new Error('NO IMPL'));
    let address = 'London';
    let options = { fallbackToGoogle: false };
    await expect(
      geocoder.geocodeAddress(address, options)
    ).rejects.toThrowError();
  });

  it('should call googleApi function with address if fallbackToGoogle is set and native fails', async () => {
    nativeImpl.geocodeAddress = () => Promise.reject(new Error('NO IMPL'));
    let address = 'London';
    let options = {
      fallbackToGoogle: true,
      apiKey: 'TEST',
      locale: 'en',
    };
    await geocoder.geocodeAddress(address, options);
    expect(googleApi.geocodeAddress).toMatchSnapshot();
  });

  it('should call googleApi function with address and bounds', async () => {
    nativeImpl.geocodeAddress = () => Promise.reject(new Error('NO IMPL'));
    let address = 'London';
    let bounds = { sw: { lat: 40, lng: -20 }, ne: { lat: 60, lng: 10 } };
    let options = {
      fallbackToGoogle: true,
      apiKey: 'TEST',
      locale: 'en',
      bounds,
    };
    await geocoder.geocodeAddress(address, options);
    expect(googleApi.geocodeAddressWithBounds).toMatchSnapshot();
  });
});
