import { useCallback, useEffect, useState } from 'react'
import { FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompletedTasks, fetchTasks, fetchUncompletedTasks } from '../../redux/taskSlice';
import EventItems from '../events/eventItems';
import AddTaskComponent from '../../components/addTaskComponent';
import { PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { firebaseToken } from '../../redux/constanSlice'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
const styles = StyleSheet.create({
    leftAction: {
        flex: 1,
    },
    actionText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
});

const HighlightSection = () => {
    const { listUncompleted, status } = useSelector((state) => state.tasks);
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchUncompletedTasks());
    }, []);
    return (
        <View className="p-5">
            <Text className="text-[#2b79c9] font-bold text-2xl mb-3">Highlight</Text>
            {/* {status == "loading" ? ( */}
            {/* <View><Text>loading...</Text></View> */}
            {/* ) : ( */}
            <EventItems events={listUncompleted} />

            {/* )} */}
        </View>
    )
}
const CompletedSection = () => {
    const { listCompleted, status } = useSelector((state) => state.tasks);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCompletedTasks());
    }, []);
    if (listCompleted.length == 0) return <></>
    return (
        <View className="p-5">
            <Text className="text-[#2b79c9] font-bold text-2xl mb-3">Terselesaikan</Text>
            {/* {status == "loading" ? ( */}
            {/* <View><Text>loading...</Text></View> */}
            {/* ) : ( */}
            <EventItems events={listCompleted} />

            {/* )} */}
        </View>
    )
}

const HomeScreen = () => {
    const dispatch = useDispatch();
    const [dataCategories, setDataCategories] = useState([
        { id: 1, title: 'All', icon: '📃' },
        { id: 2, title: 'Urgent', icon: '🌟' },
        { id: 3, title: 'Future', icon: '😎' },
    ])
    const { list, status } = useSelector((state) => state.tasks);
    const isFocused = useIsFocused();
    useEffect(()=> {
        dispatch(fetchTasks());
    },[isFocused])
    useEffect(() => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then(() => {
            messaging()
                .getToken()
                .then(token => {
                    dispatch(firebaseToken(token))
                });
        });
    }, [])
    return (<>
        <FlatList
            className='bg-[#f2f7f7]'
            ListHeaderComponent={
                <>
                    {/* <ImageBackground className={`h-[${height}]`} resizeMode='cover' source={require('../../assets/bg1.jpg')}> */}
                    <View className="flex flex-row items-center p-5">
                        <View className="flex-[70%]">
                            <Text className="text-[#2b79c9] font-light text-2xl">Hello,</Text>
                            <Text className="text-[#2b79c9] font-bold text-4xl">Tova Maulana Irvan</Text>
                        </View>
                        <View className="flex-1 items-end">
                            <Image className="object-cover w-[70] h-[70] rounded-full" source={require('../../assets/profile.jpeg')} />
                        </View>
                    </View>
                    {/* <View className="p-5">
                        <View className="bg-white h-[50] rounded-xl shadow">
                            <TextInput placeholder='Cari Sesuatu...' placeholderTextColor='#aaa' className='h-[100%] px-2 font-bold' />
                        </View>
                    </View>
                    <View className="p-5">
                        <Text className="text-[#2b79c9] font-bold text-2xl">Category</Text>
                    </View>
                    <FlatList
                        horizontal
                        data={dataCategories}
                        ItemSeparatorComponent={<View className="w-2"></View>}
                        ListHeaderComponent={<View className="w-5"></View>}
                        ListFooterComponent={<View className="w-5"></View>}
                        renderItem={({ item }) => (
                            <View className="w-[200]">
                                <View className="bg-[#ffffffdd] p-3 py-[25] rounded-2xl">
                                    <Text className="text-black text-3xl pb-[15]">{item.icon}</Text>
                                    <Text className="text-[#333] text-3xl">{item.title}</Text>
                                </View>
                            </View>
                        )}
                    /> */}
                    {/* <HighlightSection /> */}
                    {/* <CompletedSection /> */}
                    <View className='px-5 mt-5'>
                        <Text className="text-[#2b79c9] font-bold text-2xl mb-3">Daftar Tugas</Text>
                    </View>
                    <EventItems events={list} />
                    {/* </ImageBackground> */}
                </>
            }


        />
        <AddTaskComponent />

    </>)
}

export default HomeScreen