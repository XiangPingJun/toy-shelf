export interface Snippet {
  model: string;
  text: string;
  video: string;
  image: string;
  camera: {
    position: {
      x: number;
      y: number;
      z: number;
    };
    target: {
      x: number;
      y: number;
      z: number;
    };
  };
}
