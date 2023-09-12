import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { TextInput } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, deleteTask, fetchTasks, updateTask } from '../../redux/taskSlice';
import { getTheme, themeColor } from '../../screens/events/theme';
import { TaskData } from '../../types/task';
import ReactNativeCalendarEvents from 'react-native-calendar-events';
const DetailEvent = ({ route, navigation }) => {
    const { event } = route.params
    const [modalVisible, setModalVisible] = useState(false)
    const [remindMe, setRemindMe] = useState('5minutesbefore')
    const [date, setDate] = useState(dayjs())
    const [time, setTime] = useState(dayjs())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [combinedDateTime, setCombinedDateTime] = useState(new Date())
    const dispatch = useDispatch()
    const theme = useRef(getTheme());
    const [markedDates, setMarkedDates] = useState({});
    const { refetch } = useSelector((state) => state.constan);
    const todayBtnTheme = useRef({
        todayButtonTextColor: themeColor
    });
    const [editTaskForm, setEditTaskForm] = useState<TaskData>({
        title: event.title,
        description: event.description,
        startDate: event.startDate || combinedDateTime,
        endDate: event.startDate || combinedDateTime,
        done: event.done,
        reminder: event.reminder || remindMe,
        eventId: event.eventId,
        startDateOnly: event.startDateOnly
    })
    const handleUpdateTask = () => {
        if (!event.calendar && !event.eventId) {
            // maka ini  tasks
            dispatch(updateTask({
                taskId: event.id,
                taskData: editTaskForm
            }))
            console.log('update task sukses')
        } else if (event.calendar && !event.eventId) {
            ReactNativeCalendarEvents.saveEvent(editTaskForm.title, {
                calendarId: '141',
                id: event.id,
                startDate: dayjs(editTaskForm.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                endDate: dayjs(editTaskForm.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                description: editTaskForm.description,
            }).then((res) => {
                console.log('update local calendar sukses')

            }).catch((err) => {
                console.log(err, '0--------rr')
            })
        } else {
            ReactNativeCalendarEvents.saveEvent(editTaskForm.title, {
                calendarId: '141',
                id: event.eventId,
                startDate: dayjs(editTaskForm.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                endDate: dayjs(editTaskForm.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                description: editTaskForm.description,
            }).then((res) => {
                dispatch(updateTask({
                    taskId: event.id,
                    taskData: editTaskForm
                }))
                console.log('update local calendar & tasks sukses')

            }).catch((err) => {
                console.log(err, '0--------rr')
            })
        }
        // if (!event.eventId) {
        //     dispatch(updateTask({
        //         taskId: event.id,
        //         taskData: editTaskForm
        //     }))
        // } else {
        //     ReactNativeCalendarEvents.saveEvent(editTaskForm.title, {
        //         calendarId: '141',
        //         id: event.eventId,
        //         startDate: dayjs(editTaskForm.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        //         endDate: dayjs(editTaskForm.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
        //         description: editTaskForm.description,
        //     }).then((res) => {
        //         dispatch(updateTask({
        //             taskId: event.id,
        //             taskData: editTaskForm
        //         }))

        //     }).catch((err) => {
        //         console.log(err, '0--------rr')
        //     })
        // }
        setRemindMe('5minutesbefore')
        dispatch(fetchTasks())
        navigation.goBack()
    }
    const handleDeleteTask = () => {
        if (!event.calendar && !event.eventId) {
            // maka ini  tasks
            dispatch(deleteTask(event.id))
            console.log('delete task sukses')
        } else if (event.calendar && !event.eventId) {
            ReactNativeCalendarEvents.removeEvent(event.id).then(() => {
                console.log('delete event sukses')
            })
        } else {
            ReactNativeCalendarEvents.removeEvent(event.eventId).then(() => {
                dispatch(deleteTask(event.id))
                console.log('delete event dan tasks sukses')
            })
        }
        setRemindMe('5minutesbefore')
        dispatch(fetchTasks())
        navigation.goBack()
    }

    const handleDatePress = (date) => {
        // If a date is already selected, unmark it
        if (date) {
            const markedDates = { ...date, [date]: { selected: false } };
            setDate('');
            setMarkedDates(markedDates);
        }

        // Mark the newly selected date
        const markedDates = { ...date, [date.dateString]: { selected: true, selectedColor: '#2b79c9' } };
        setDate(date.dateString);
        setMarkedDates(markedDates);
    };

    useEffect(() => {
        // const combinedDate = new Date(
        //     date.getFullYear(),
        //     date.getMonth(),
        //     date.getDate(),
        //     time.getHours(),
        //     time.getMinutes(),
        //     time.getSeconds()
        // );
        const selectedDate = dayjs(date)
        const selectedTime = dayjs(time)
        const combine = selectedDate
            .set('hour', selectedTime.hour())
            .set('minute', selectedTime.minute())
            .set('millisecond', selectedTime.millisecond())
        setCombinedDateTime(combine)
        setEditTaskForm({ ...editTaskForm, startDate: dayjs(new Date(combine)).format(), startDateOnly: dayjs(new Date(combine)).format('YYYY-MM-DD') })
        // console.log(combinedDate)
        // date.setHours(time.getHours(),time.getMinutes(),time.getMilliseconds())
    }, [date, time])
    return (<>
        <Pressable className='absolute bottom-0 right-0 m-7 bg-[#2b79c9] p-5 rounded-full'
            style={{
                elevation: 5,
                shadowColor: '#2b79c9'
            }}
            android_ripple={{
                color: '#ffffff55'
            }}
            onPress={handleUpdateTask}
        >
            <MaterialIcon color="white" name="send-outline" size={20} />
        </Pressable>
        <Animated.View className="bg-white p-3 rounded-tl-xl rounded-xl mx-2 mt-2">
            <View className='flex-row items-center'>
                <View className='flex-1'>
                    <TextInput selectionColor={'#2b79c9'} className='font-bold text-xl' placeholder='Nama Task' defaultValue={editTaskForm.title} onChangeText={(text) => setEditTaskForm({ ...editTaskForm, title: text })} />
                    <TextInput selectionColor={'#2b79c9'} placeholder='Deskripsi (optional)' multiline defaultValue={editTaskForm.description} onChangeText={(text) => setEditTaskForm({ ...editTaskForm, description: text })} />
                </View>
            </View>
            <View className='flex-row items-center justify-between mb-3'>
                <Text className='text-slate-600 font-bold'>Tanggal & Waktu</Text>
                <Pressable className='bg-slate-100 rounded-full flex-row items-center pl-4'
                    onPress={() => setShowDatePicker(true)}
                >
                    <MaterialIcon name="alarm" color='#333' size={20} />
                    <View className='w-[150] p-[17]'>
                        <Text className='text-black'>{dayjs(editTaskForm.startDate).format('DD/MM/YYYY')}</Text>
                    </View>

                </Pressable>
            </View>
        </Animated.View>
        <View className='bg-white mt-3 mx-2'>
            <Pressable className='p-3 items-center justify-center flex-row' onPress={handleDeleteTask}>
                <MaterialIcon name="trash-can" color='#ff0029' size={20} />
                <Text className='text-[#ff0029] ml-2'>Hapus</Text>
            </Pressable>
        </View>
        <Modal
            hardwareAccelerated
            animationType="fade"
            transparent={true}
            visible={showDatePicker}
            onRequestClose={() => {
                setShowDatePicker(!showDatePicker);
            }}>

            <View className='bg-[#00000055] p-5 h-[100%] justify-center'>
                <View className='bg-white p-3 rounded-xl'>
                    <Calendar
                        theme={theme.current}
                        firstDay={1}
                        enableSwipeMonths={true}
                        onDayPress={(day) => handleDatePress(day)}
                        markedDates={markedDates}



                    />
                    <View className='flex-row items-center justify-between mb-3'>
                        <Text className='text-slate-600 font-bold'>Waktu</Text>
                        <Pressable className='bg-slate-100 rounded-full flex-row items-center pl-4'
                            onPress={() => setShowTimePicker(true)}
                        >
                            <MaterialIcon name="alarm" color='#333' size={20} />
                            <View className='w-[150] p-[17]'>
                                <Text className='text-black'>{dayjs(time).format('HH:mm A')}</Text>
                            </View>

                        </Pressable>
                    </View>
                    <View className='flex-row items-center justify-between mb-3'>
                        <Text className='text-slate-600 font-bold'>Ingatkan Saya</Text>
                        <Pressable className='bg-slate-100 rounded-full flex-row items-center pl-4'>
                            <MaterialIcon name="alarm" color='#333' size={20} />
                            <Picker
                                mode='dropdown'
                                style={{ width: 150 }}
                                selectedValue={remindMe}
                                onValueChange={(itemValue, itemIndex) => {
                                    setRemindMe(itemValue)

                                }}>
                                <Picker.Item label="5 Menit Sebelumnya" value="5minutesbefore" />
                                <Picker.Item label="Tepat Waktu" value="pass" />
                            </Picker>

                        </Pressable>
                    </View>
                    <View className='flex-row justify-end'>
                        <Pressable onPress={() => setShowDatePicker(false)}>
                            <Text className='p-2 text-[#2b79c9] font-bold'>Simpan</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
        {
            showTimePicker && (
                <DateTimePicker

                    value={new Date(time)}
                    display='clock'
                    mode='time'
                    is24Hour={true}
                    onChange={(e) => {
                        setTime(dayjs(e.nativeEvent.timestamp).format('YYYY-MM-DD HH:mm:ss'))
                        setShowTimePicker(false)
                    }}
                />
            )
        }
    </>)
}

export default DetailEvent