import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Animated, { SlideInDown, SlideInUp } from 'react-native-reanimated';
import { Pressable, StyleSheet, Modal, View, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux'
import { addTask } from '../redux/taskSlice';
import { useEffect, useRef, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import dayjs from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, CalendarList, CalendarProvider, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';
import { getTheme, themeColor } from '../screens/events/theme';
import { TaskData } from '../types/task';
import ReactNativeCalendarEvents from 'react-native-calendar-events';
const AddTaskComponent = () => {
    const [modalVisible, setModalVisible] = useState(false)
    const [remindMe, setRemindMe] = useState('5minutesbefore')
    const [date, setDate] = useState(dayjs())
    const [time, setTime] = useState(dayjs())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [combinedDateTime, setCombinedDateTime] = useState(new Date())
    const [addToCalendar, setAddToCalendar] = useState(true)
    const dispatch = useDispatch()
    const theme = useRef(getTheme());
    const [markedDates, setMarkedDates] = useState({});
    const todayBtnTheme = useRef({
        todayButtonTextColor: themeColor
    });
    const [addTaskForm, setAddTaskForm] = useState<TaskData>({
        title: "",
        description: "",
        startDate: combinedDateTime,
        endDate: "",
        done: false,
        reminder: remindMe,
        startDateOnly: ""
    })
    const handleAddTask = () => {
        setModalVisible(false)
        if (!addToCalendar) {
            dispatch(addTask(addTaskForm))
        } else {
            ReactNativeCalendarEvents.saveEvent(addTaskForm.title, {
                calendarId: '141',
                startDate: dayjs(addTaskForm.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                endDate: dayjs(addTaskForm.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                description: addTaskForm.description,
            }).then((res) => {
                dispatch(addTask({
                    ...addTaskForm,
                    eventId: res
                }))

            }).catch((err) => {
                console.log(err, '0--------rr')
            })
        }
        setRemindMe('5minutesbefore')
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
        setAddTaskForm({ ...addTaskForm, startDate: dayjs(new Date(combine)).format(), startDateOnly: dayjs(new Date(combine)).format('YYYY-MM-DD') })
        // console.log(combinedDate)
    }, [date, time])
    return (<>
        <Pressable className='absolute bottom-0 right-0 m-7 bg-[#2b79c9] p-3 rounded-full'
            style={{
                elevation: 5,
                shadowColor: '#2b79c9'
            }}
            android_ripple={{
                color: '#ffffff55'
            }}
            onPress={() => setModalVisible(true)}
        >
            <MaterialIcon color="white" name="plus" size={35} />
        </Pressable>
        <Modal
            hardwareAccelerated
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <Pressable className='h-[100%] w-[100%] absolute bg-[#00000077]' onPress={() => setModalVisible(false)} />
            <Animated.View entering={SlideInDown} exiting={SlideInUp} className="bg-white bottom-0 absolute w-full z-[2] p-3 rounded-tl-xl rounded-tr-xl">
                <View className='flex-row items-center'>
                    <View className='flex-1'>
                        <TextInput selectionColor={'#2b79c9'} className='font-bold text-xl' placeholder='Nama Task' autoFocus onChangeText={(text) => setAddTaskForm({ ...addTaskForm, title: text })} />
                        <TextInput selectionColor={'#2b79c9'} placeholder='Deskripsi (optional)' multiline onChangeText={(text) => setAddTaskForm({ ...addTaskForm, description: text })} />
                    </View>
                    <View className='flex'>
                        <Pressable className='bg-[#2b79c9] p-3 rounded-xl px-4'
                            style={{
                                elevation: 10,
                                shadowColor: '#2b79c9'
                            }}
                            android_ripple={{
                                color: '#ffffff55',
                            }}
                            onPress={handleAddTask}
                        >
                            <MaterialIcon color="white" name="send-outline" size={20} />
                        </Pressable>
                    </View>
                </View>
                <View className='flex-row items-center justify-between mb-3'>
                    <Text className='text-slate-600 font-bold'>Tambahkan ke Kalendar (Acara)</Text>
                    <Pressable className='flex-row items-center'
                        onPress={() => setAddToCalendar(!addToCalendar)}
                    >
                        {addToCalendar ? (
                            <MaterialIcon name="checkbox-marked" color='#2b79c9' size={30} />
                        ) : (
                            <MaterialIcon name="checkbox-blank-outline" color='#333' size={30} />
                        )}
                    </Pressable>
                </View>
                <View className='flex-row items-center justify-between mb-3'>
                    <Text className='text-slate-600 font-bold'>Tanggal & Waktu</Text>
                    <Pressable className='bg-slate-100 rounded-full flex-row items-center pl-4'
                        onPress={() => setShowDatePicker(true)}
                    >
                        <MaterialIcon name="alarm" color='#333' size={20} />
                        <View className='w-[150] p-[17]'>
                            <Text className='text-black'>{dayjs(date).format('DD/MM/YYYY')}</Text>
                        </View>

                    </Pressable>
                </View>
            </Animated.View>
        </Modal>
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
        {showTimePicker && (
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
        )}
    </>)
}

export default AddTaskComponent