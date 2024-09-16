# User reported internet speeds in Dhaka

This project aggregates speed test results submitted by visitors on the site. The goal is to map out the difference between speeds advertised by ISPs and the actual speeds experienced by users.

## Dashboard

Google Maps embedded with markers for each speed test result. The markers are color coded based on the speed test result.

### Markers

#### Colors

- Green: reported speed close or equal to advertised speed
- Yellow: reported speed is less than advertised speed
- Red: reported speed is significantly less than advertised speed

#### Memoization

The markers are memoized to prevent re-rendering on each state change. The memoization is done using the `useMemo` hook.

`React.memo()` is a higher-order component that memoizes the rendered output of the wrapped component. The `MemoizedMarker` components only re-render when their specific props change.

```tsx
const MemoizedMarker = React.memo(({ point, setMarkerRef, ... }) => (...));
```

`useMemo()` hook memoizes the result of a computation. In this case, the computation is the creation of the points array. The memoizedPoints array reference only changes when the actual data changes.

```tsx
const memoizedPoints = useMemo(() => points, [points]);
```

`useCallback()` hook returns a memoized version of the callback function that only changes if one of the dependencies has changed. It prevents unnecessary re-creation of these functions on every render of the Markers component.

```tsx
// setMarkerRef
const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
  // ... function body ...
}, [markers]);

// ratioToColor
const ratioToColor = useCallback((advertised: number, download: number) => {
  // ... function body ...
}, []);
```

### Filtering

Dropdown to filter results by ISP.

### Form

Self report form to add visitor's speed test results. The form includes fields for:

- ISP
- Advertised speed
- Reported speed

Speed measured and reported using Speedtest.net API.

## Hero section

[GitHub Globe](https://ui.aceternity.com/components/github-globe) UI Component from Aceternity UI.