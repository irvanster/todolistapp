export interface TaskData {
  alarms?: { date: Date }[];
  allDay?: boolean;
  attendees?: any[];
  availability?: string;
  calendar?: any;
  title: string;
  description: string;
  startDate: Date;
  endDate?: string;
  done?: boolean;
  reminder?: string;
  eventId?: string
  startDateOnly?: string
}

