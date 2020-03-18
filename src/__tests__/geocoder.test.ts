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

beforeEach(geocoder.resetModule);

describe('init', () => {
  it('should throw if module is not inited', async () => {
    await expect(geocoder.geocodeAddress('London')).rejects.toThrowError(
      'not initialized'
    );
  });

  it('should call native function when init', async () => {
    await geocoder.init({
      maxResults: 10,
      locale: 'fr',
      fallbackToGoogle: true,
    });
    expect(nativeImpl.init).toBeCalledWith('fr', 10);
  });
});

describe('geocode position', () => {
  it('should throw if position is invalid', async () => {
    await geocoder.init();
    // @ts-ignore: Expect to throw
    await expect(geocoder.geocodePosition({})).rejects.toThrowError();
  });

  it('should call native function with position', async () => {
    await geocoder.init();
    let position = { lat: -1.2, lng: 3.4 };
    await geocoder.geocodePosition(position);
    expect(nativeImpl.geocodePosition).toBeCalledWith(position);
  });

  it('should throw if native function rejects and fallbackToGoogle is not set', async () => {
    nativeImpl.geocodePosition = () => Promise.reject(new Error('NO IMPL'));
    let position = { lat: -1.2, lng: 3.4 };
    await geocoder.init();
    await expect(geocoder.geocodePosition(position)).rejects.toThrowError();
  });

  it('should call googleApi function with position if fallbackToGoogle is set and native fails', async () => {
    nativeImpl.geocodePosition = () => Promise.reject(new Error('NO IMPL'));
    let position = { lat: -1.2, lng: 3.4 };
    await geocoder.init({
      fallbackToGoogle: true,
      apiKey: 'TEST',
      locale: 'de',
    });
    await geocoder.geocodePosition(position);
    expect(googleApi.geocodePosition).toBeCalledWith('TEST', position, 'de');
  });
});

describe('geocode address', () => {
  it('should throw if address is invalid', async () => {
    await geocoder.init();
    expect(geocoder.geocodeAddress('')).rejects.toThrowError();
  });

  it('should call native function with address and bounds', async () => {
    await geocoder.init();
    let address = 'Birmingham';
    let bounds = { sw: { lat: 40, lng: -20 }, ne: { lat: 60, lng: 10 } };
    await geocoder.geocodeAddress(address, bounds);
    expect(nativeImpl.geocodeAddressWithBounds).toBeCalledWith(
      address,
      40,
      -20,
      60,
      10
    );
  });

  it('should throw if native function rejects and fallbackToGoogle is not set', async () => {
    nativeImpl.geocodeAddress = () => Promise.reject(new Error('NO IMPL'));
    let address = 'London';
    await geocoder.init({ fallbackToGoogle: false });
    await expect(geocoder.geocodeAddress(address)).rejects.toThrowError();
  });

  it('should call googleApi function with address if fallbackToGoogle is set and native fails', async () => {
    nativeImpl.geocodeAddress = () => Promise.reject(new Error('NO IMPL'));
    let address = 'London';
    await geocoder.init({
      fallbackToGoogle: true,
      apiKey: 'TEST',
      locale: 'en',
    });
    await geocoder.geocodeAddress(address);
    expect(googleApi.geocodeAddress).toBeCalledWith('TEST', address, 'en');
  });

  it('should call googleApi function with address and bounds', async () => {
    nativeImpl.geocodeAddressWithBounds = () =>
      Promise.reject(new Error('NO IMPL'));
    let address = 'London';
    let bounds = { sw: { lat: 40, lng: -20 }, ne: { lat: 60, lng: 10 } };
    await geocoder.init({
      fallbackToGoogle: true,
      apiKey: 'TEST',
      locale: 'en',
    });
    await geocoder.geocodeAddress(address, bounds);
    expect(googleApi.geocodeAddressWithBounds).toBeCalledWith(
      'TEST',
      address,
      bounds,
      'en'
    );
  });
});
