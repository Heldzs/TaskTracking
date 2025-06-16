export interface Tasklist {
  id: Number;
  title: String;
  priority: Number;
  done: Boolean;
  due_date: String;
  created_at: String;
}

export interface Tasks {
  id: Number;
  tasklist: Number;
  content: String;
  priority: Number;
  created_at: String;
  due_date: String;
  done: Boolean;
}

export interface Category {
  id: Number;
  name: String;
}
