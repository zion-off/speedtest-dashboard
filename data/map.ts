const mapStyle: any[] = [
    {
      stylers: [
        {
          hue: "#ff1a00",
        },
        {
          invert_lightness: true,
        },
        {
          saturation: -100,
        },
        {
          lightness: 33,
        },
        {
          gamma: 0.5,
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#00bfff",
        },
      ],
    },
  ];
  
  export default mapStyle;