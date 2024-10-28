export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: {
    city?: string;
    district?: string;
    ward?: string;
    address?: string;
  };
  participants?: string[];
  googleMeetLink?: string;
}
