import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import { TaskData } from '../../types/task';
import store from '../store';
export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  const snapshot = await firestore().collection('tasks').get();
  const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return tasks;
});

export const fetchCompletedTasks = createAsyncThunk(
  'tasks/fetchCompletedTasks',
  async () => {
    const snapshot = await firestore()
      .collection('tasks')
      .where('done', '==', true)
      .get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tasks;
  },
);
export const fetchUncompletedTasks = createAsyncThunk(
  'tasks/fetchUncompletedTasks',
  async () => {
    const snapshot = await firestore()
      .collection('tasks')
      .where('done', '==', false)
      .get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return tasks;
  },
);

export const addTask = createAsyncThunk('tasks/add', async (taskData: TaskData) => {
  await firestore().collection('tasks').add(taskData);
  console.log(store.getState().constan.firebaseToken)
  fetch('http://149.28.148.16:5050/scheduler', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: taskData.title,
      startDate: taskData.startDate,
      reminder: taskData.reminder,
      token: store.getState().constan.firebaseToken,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
    .catch((error) => {
      console.log(error)
    });






  return taskData;
});
export const updateTask = createAsyncThunk('tasks/update', async ({ taskId, taskData }) => {
  
  await firestore().collection('tasks').doc(taskId).update(taskData);
  console.log(store.getState().constan.firebaseToken)
  fetch('http://149.28.148.16:5050/scheduler', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: taskData.title,
      startDate: taskData.startDate,
      reminder: taskData.reminder,
      token: store.getState().constan.firebaseToken,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
    .catch((error) => {
      console.log(error)
    });

  return taskData;
});
export const fetchByDate = createAsyncThunk('tasks/fetchByDate', async (selectedDate: Date) => {
  const snapshot = await firestore().collection('tasks') // Replace with your collection name
    .where('startDateOnly', '==', selectedDate).get()
  const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return tasks;
});

export const doneTask = createAsyncThunk(
  'tasks/doneTask',
  async ({ taskId, status }) => {
    await firestore().collection('tasks').doc(taskId).update({
      done: status,
    });
  },
);
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: string) => {
    await firestore().collection('tasks').doc(taskId).delete()
  },
);
const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    listCompleted: [],
    listUncompleted: [],
    listByDate: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTask.pending, state => {
        state.status = 'loading';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateTask.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(doneTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(fetchCompletedTasks.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.listCompleted = action.payload;
      })
      .addCase(fetchCompletedTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchUncompletedTasks.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchUncompletedTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.listUncompleted = action.payload;
      })
      .addCase(fetchUncompletedTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchByDate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.listByDate = action.payload
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
  },
});

export default taskSlice.reducer;
