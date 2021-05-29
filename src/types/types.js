export type TransportOption = {
  type: String,
  route_no: String,
  devid: String,
  data: TransportOptionLocationData,
};

export type TransportOptionsProps = {
  item: TransportOption,
  index: number,
};

export type TransportOptionLocationDataData = {
  id: number,
  devid: String,
  latitude: number,
  longitude: number,
  button_press: number,
  power_good: number,
  rssi: number,
  velocity: number,
  tamper: number,
  battery: number,
  oct1: number,
  oct2: number,
  oct3: number,
  createdAt: String,
  updatedAt: String,
  createdAtDateObject: Date,
  updatedAtDateObject: Date,
};

export type TransportOptionLocationData = {
  status: String,
  debug: Boolean,
  data: TransportOptionLocationDataData,
};
