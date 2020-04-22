import { renderHook } from '@testing-library/react-hooks';
import { useGeocodePosition, useGeocodeAddress } from '../hooks';

jest.mock('../geocoder', () => ({
  geocodePosition: jest.fn(pos => pos),
  geocodeAddress: jest.fn((addr, options) => ({
    addr,
    bounds: options?.bounds,
  })),
}));

it('should call geocoder geocodePosition with useGeocodePosition', async () => {
  let { result, waitForNextUpdate } = renderHook(() =>
    useGeocodePosition({ lat: 10, lng: -20 })
  );
  await waitForNextUpdate();
  expect(result.current).toEqual({
    result: { lat: 10, lng: -20 },
    error: null,
    loading: false,
  });
});

it('should call geocoder geocodeAddress with useGeocodeAddress', async () => {
  let { result, waitForNextUpdate } = renderHook(() =>
    useGeocodeAddress('London')
  );
  await waitForNextUpdate();
  expect(result.current).toEqual({
    result: { addr: 'London' },
    error: null,
    loading: false,
  });
});

it('should call geocoder geocodeAddress with bounds', async () => {
  let { result, waitForNextUpdate } = renderHook(() =>
    useGeocodeAddress('London', {
      bounds: { sw: { lat: 10, lng: -20 }, ne: { lat: -20, lng: 10 } },
    })
  );
  await waitForNextUpdate();
  expect(result.current).toEqual({
    result: {
      addr: 'London',
      bounds: { sw: { lat: 10, lng: -20 }, ne: { lat: -20, lng: 10 } },
    },
    error: null,
    loading: false,
  });
});
