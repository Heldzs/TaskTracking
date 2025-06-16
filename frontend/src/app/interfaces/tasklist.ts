export interface Tasklist {
  id?: number;
  title: string;
  priority?: number;
  done?: boolean;
  due_date?: string;
  created_at?: string;
  tasks?: Task[];
}

export interface Task {
  id?: number;
  tasklist?: number;
  content: string;
  priority?: string
  created_at?: string;
  due_date?: string;
  done?: boolean;
}

export interface Category {
  id: Number;
  name: String;
}
