import dayjs from "dayjs"
import { Text, View, Pressable, LayoutAnimation } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import Animated, { FadeIn, FadeInLeft, FadeInRight, FadeOut, FadeOutLeft, FadeOutRight, SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { useDispatch } from 'react-redux'
import { doneTask, fetchCompletedTasks, fetchTasks, fetchUncompletedTasks } from '../../redux/taskSlice';
import { useNavigation } from '@react-navigation/native';
const EventItems = ({ events, fromEvent=false }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const handleDone = (taskId, status) => {
        dispatch(doneTask({ taskId, status }))
        dispatch(fetchTasks())
        // dispatch(fetchCompletedTasks())
        // dispatch(fetchUncompletedTasks())
    }
    return (
        <FlatList
            data={events}
            ListEmptyComponent={() => {
                return (
                    <View className="items-center justify-center py-[50%]">
                        <MaterialIcon className="text-base" name="text-box-multiple-outline" size={70} />
                        <Text className="mt-2 text-center text-2xl">Tidak ada agenda{`\n`}Pilih hari lain atau tambahkan.</Text>
                    </View>
                )
            }}
            keyExtractor={(item) => item.id}
            ListFooterComponent={<View className="h-[200]" />}
            renderItem={({ item }) => {
                return (
                    <Animated.View className={`bg-white p-5 mx-5 mb-3 rounded-xl ${!fromEvent && item.done && 'opacity-[0.7]'}`} style={{ elevation: 10, shadowColor: '#00000022' }}
                        entering={FadeInRight.duration(200)} exiting={FadeOutLeft.duration(200)}
                        key={item.id}
                    >
                        <Pressable onPress={() => navigation.navigate('DetailEvent', {
                            event: item,
                        })}>
                            <View className="flex-row items-center justify-between">
                                <View className="w-[90%]">
                                    <Text className={`text-black font-bold text-xl ${!fromEvent && item.done && 'line-through'}`}>{item.title}</Text>
                                    <View className="flex flex-row items-center mt-3">
                                        {item.description && (
                                            <View className="mr-3">
                                                <MaterialIcon color="#777" name="text" size={20} />
                                            </View>
                                        )}
                                        <View className="flex-row items-center">
                                            <MaterialIcon color="#777" name="timer-outline" size={20} />
                                            {dayjs(item.startDate).format('DD-MM-YYYY') !== dayjs(item.endDate).format('DD-MM-YYYY') ? (
                                                <Text className={`text-[#777] font-bold ml-1 ${!fromEvent && item.done && 'line-through'}`}>{dayjs(item.startDate).format('DD/MM/YYYY,')} {dayjs(item.startDate).format('HH:mm A')} {item.endDate && '—\n' + dayjs(item.endDate).format('DD/MM/YYYY,') + dayjs(item.endDate).format('HH:mm A')}</Text>
                                            ) : (
                                                <Text className={`text-[#777] font-bold ml-1 ${!fromEvent && item.done && 'line-through'}`}>{dayjs(item.startDate).format('DD/MM/YYYY,')} {dayjs(item.startDate).format('HH:mm A')} {item.endDate && '— ' + dayjs(item.endDate).format('HH:mm A')}</Text>
                                            )}
                                        </View>

                                    </View>
                                    {item.location && (
                                        <View className="flex-row mt-2">
                                            <MaterialIcon color='#777' name="map-marker-outline" size={20} />
                                            <Text className="font-light items-center text-[#777]">{item.location}</Text>
                                        </View>

                                    )}
                                </View>
                                {!fromEvent && (
                                    <View>
                                        {item.done ? (
                                            <Pressable onPress={() => handleDone(item.id, false)} hitSlop={25}>
                                                <MaterialIcon color="#2b79c9" name='checkbox-marked' size={30} />
                                            </Pressable>
                                        ) : (
                                            <Pressable onPress={() => handleDone(item.id, true)} hitSlop={25}>
                                                <MaterialIcon name='checkbox-blank-outline' size={30} />
                                            </Pressable>
                                        )}
                                    </View>
                                )}
                            </View>

                        </Pressable>
                    </Animated.View>

                )
            }}

        />
    )
}

export default EventItems