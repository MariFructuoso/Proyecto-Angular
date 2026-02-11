export interface Comment {
  id?: number;
  text: string;
  rating: number;
  user: {
    name: string;
    avatar?: string;
  };
}