import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import RNCalendarEvents from "react-native-calendar-events";
import { CalendarProvider, ExpandableCalendar, LocaleConfig } from 'react-native-calendars';
import AddTaskComponent from '../../components/addTaskComponent';
import EventItems from './eventItems';
import { getTheme, lightThemeColor, themeColor } from './theme';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchByDate } from '../../redux/taskSlice';
import { View } from 'react-native'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

LocaleConfig.locales['id'] = {
  monthNames: [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des'
  ],
  dayNames: [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu'
  ],
  dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
  today: "Hari ini"
};

LocaleConfig.defaultLocale = 'id';




const EventsScreen = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs(Date.now()).format('YYYY-MM-DD'))
  const [eventData, setEventData] = useState([])
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor
  });
  const startDate = new Date(`${selectedDate}T00:00:00.000Z`)
  const endDate = new Date(`${selectedDate}T23:59:59.999Z`)
  startDate.setHours(startDate.getHours() + 7);
  endDate.setHours(endDate.getHours() + 7);

  // Konversi ke ISO 8601
  const isoStartDate = startDate.toISOString();
  const isoEndDate = endDate.toISOString();


  const { listByDate } = useSelector((state) => state.tasks);
  const dispatch = useDispatch()
  const isFocused = useIsFocused();
  useEffect(() => {
    dispatch(fetchByDate(dayjs(selectedDate).format('YYYY-MM-DD')));
  }, [selectedDate, isFocused]);

  useFocusEffect(
    useCallback(() => {
      RNCalendarEvents.checkPermissions((readOnly = false)).then((status) => {
        if (status == "authorized") {
          console.log('authorized')
        } else {
          RNCalendarEvents.requestPermissions((readOnly = false))
        }
      }).then(() => {
        RNCalendarEvents.fetchAllEvents(isoStartDate, isoEndDate).then((localEvent: any) => {
          setEventData(localEvent)
          // setEventData(localEvent.concat(listByDate))
        })
      })
    }, [selectedDate, isFocused])
  );
  const onDateChanged = (date: string) => {
    setSelectedDate(date)
  }


  return (<>
    <CalendarProvider
      date={dayjs(new Date()).format('YYYY-MM-DD')}
      onDateChanged={onDateChanged}
      showTodayButton={false}
      theme={todayBtnTheme.current}
      className='bg-[#f2f7f7]'

    >
      <ExpandableCalendar
        theme={theme.current}
        firstDay={1}

      />
      <View className='pt-3'>
        <EventItems events={eventData} fromEvent={true} />

      </View>
    </CalendarProvider>
    <AddTaskComponent />
  </>);
};

export default EventsScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20
  },
  header: {
    backgroundColor: 'lightgrey'
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize'
  }
});