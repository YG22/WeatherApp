import { StatusBar } from 'expo-status-bar';
import React,{useState ,useEffect} from 'react';
import { StyleSheet, Text, View ,Image , ImageBackground} from 'react-native';
import axios from "axios";
import * as Location from 'expo-location';
// import GetLocation from "./components/GetLocation";
export default function App () {
  const [weatherText, setWeatherText] = useState("");
  const [weatherCode, setweatherCode] = useState("1000");
  const [country, setCountry] = useState("");
  const [temperature, setTemperature] = useState("");
  const [myLocation, setMyLocation] = useState("");
  const [weatherImage, setWeatherImage] = useState('');
  const [backgroundImg ,setBackgroundImg] = useState("https://cdn5.f-cdn.com/contestentries/329593/18088126/5699feb841990_thumb900.jpg");
  const [currentDate, setCurrentDate] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude , setLatitude] = useState(0);
  const [longitude , setLongitude] = useState(0);


  //תחתון ימני div 
  const [bottomRightDate , setBottomRightDate] =useState("");
  const [bottomRightImage, setBottomRightImage] = useState('');
  const [temperatureBottomRight, setTemperatureBottomRight] = useState("");

  //תחתון שמאלי div 
  const [bottomLeftDate , setBottomLeftDate] =useState("");
  const [bottomLeftImage, setBottomLeftImage] = useState('');
  const [temperatureBottomLeft, setTemperatureBottomLeft] = useState("");

  //תמונות רקע
  const night = "https://mfiles.alphacoders.com/173/173037.jpg"; 
  const evening = "https://inhabitat.com/wp-content/blogs.dir/1/files/2018/02/The-sun-is-dimming-but-it-wont-let-us-off-the-hook-for-climate-change-lead.jpg";
  const day = "https://cdn5.f-cdn.com/contestentries/329593/18088126/5699feb841990_thumb900.jpg";
  const morning = "https://play-lh.googleusercontent.com/pzlqhMiqZ5h6KUjORkoy_zsncjejZRXsFhjOGMULr6GHXlreLGkzuE2XNtG5lSyh";

  useEffect(() => {
    
    var date = new Date().getDate(); 
    var month = new Date().getMonth() + 1; 
    var year = new Date().getFullYear().toString().substr(-2);
    var hours = new Date().getHours(); 
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();

    let text = 'Waiting...';
    // let lon = '';
    // let lat = '';
    if (errorMsg) {
      text = errorMsg;
    } else if (location) {
      text = JSON.stringify(location.coords);
      //console.log(text);
      // lat = JSON.stringify(location.coords.latitude);
      // lon = JSON.stringify(location.coords.longitude);
      // setLatitude(lat);
      // setLongitude(lon);
    }
    if(date < 10){
      date = "0" + date;
  }
    if(month < 10){
        month = "0" + month;
    }

    setCurrentDate(
      date + '/' + month + '/' + year
    );

    if(hours >= 5 && hours < 12){
      setBackgroundImg(morning);
    }
    else if(hours >= 12 && hours < 17){
      setBackgroundImg(day);
    }
    else if(hours >= 17 && hours < 19){
      setBackgroundImg(evening);
    }
    else {
      setBackgroundImg(night);
    }
  
  }, []);

  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
    params: {q: `${latitude} ,  ${longitude}` ,days: '3'},
    headers: {
      'x-rapidapi-key': '9a81319a2amsh29a74c193247378p1faba6jsn8a57fcd267fc',
      'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
    }
  };
  
  axios.request(options).then(function (response) {
    console.log(response.data);
    setMyLocation(response.data.location.name);
    setWeatherImage(response.data.current.condition.icon);
    setWeatherText(response.data.current.condition.text);
    setTemperature("\u2103" + (response.data.current.temp_c));
    setCountry(response.data.location.country);

    //תחתון שמאלי div
    let dayL = response.data.forecast.forecastday[1].date.substring(8);
    let monthL = response.data.forecast.forecastday[1].date.substring(5,7);
    setBottomLeftDate(dayL +"/"+ monthL);
    setBottomLeftImage(response.data.forecast.forecastday[1].day.condition.icon);
    setTemperatureBottomLeft("\u2103" + (response.data.forecast.forecastday[1].day.avgtemp_c));

    //תחתון ימני div 
    let dayR = response.data.forecast.forecastday[2].date.substring(8);
    let monthR = response.data.forecast.forecastday[2].date.substring(5,7);
    setBottomRightDate(dayR +"/"+ monthR);
    setBottomRightImage(response.data.forecast.forecastday[2].day.condition.icon);
    setTemperatureBottomRight("\u2103" + (response.data.forecast.forecastday[2].day.avgtemp_c));

  }).catch(function (error) {
    console.error(error);
  });

  return (
    <View style={styles.container}>
        <ImageBackground source ={{uri:`${backgroundImg}`}} style={styles.backgroundImg}>
        
        {/* חלק עליון */}
        <View style = {styles.top}>
          <Text style={[backgroundImg == night || backgroundImg == evening? styles.currentDateWhite : styles.currentDateBlack]}>
            {currentDate}
          </Text> 

          <Text style={[backgroundImg == night || backgroundImg == evening? styles.textWhiteLocation : styles.textBlackLocation]}>
              {myLocation}
          </Text>

          <Text style={[backgroundImg == night || backgroundImg == evening? styles.textWhiteCountry : styles.textBlackCountry]}
            >{country}
          </Text>    
        </View>

        {/* חלק אמצעי */}
        <View style ={styles.middle}>
        {/* צד ימין */}
          <View style = {styles.img}>
            <Image source = {{uri: `https:${weatherImage}`}}
                    style={{width: 150, height: 150}}/>
            <Text style={[backgroundImg == night || backgroundImg == evening? styles.textWhiteWeatherImage : styles.textBlackWeatherImage]}>
              {weatherText}
            </Text>   
          </View>

        {/* צד שמאל */}
             <View style ={styles.temp}>
            <Text style={[backgroundImg == night || backgroundImg == evening? styles.textWhiteTemp : styles.textBlackTemp]}>
              {temperature}
            </Text>
          </View> 
        </View>

        {/* חלק תחתון */}
        <View style ={styles.bottom}>  
          {/* צד ימין */}
          <View style={styles.bottomRight}>
              <Text style ={{color:backgroundImg !== day? '#fff':'#000' ,fontSize:30}}>
                {bottomRightDate}
              </Text>
              <Image source = {{uri: `https:${bottomRightImage}`}}
                    style={{width: 130, height: 130}}/>
              <Text style={{fontSize:30,fontWeight: "bold",color:backgroundImg == evening || backgroundImg == morning? '#fff':'#000'}}>
                {temperatureBottomRight}
              </Text>
          </View> 

            {/* צד שמאל */}
          <View style={styles.bottomLeft}>
            <Text style ={{color:backgroundImg !== day? '#fff':'#000',fontSize:30}}>
              {bottomLeftDate}
            </Text>
            <Image source = {{uri: `https:${bottomLeftImage}`}}
                    style={{width: 130, height: 130}}/>
            <Text style={{fontSize:30,fontWeight: "bold",color:backgroundImg == evening || backgroundImg == morning? '#fff':'#000'}}>
                {temperatureBottomLeft}
            </Text>
          </View>  
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

//חלק עליון
//תאריך
  currentDateWhite:{
    color:'#fff',
    fontWeight: "bold",
    fontSize: 30,
    textAlign:'center',
    marginBottom: 20,
  },

  currentDateBlack:{
    color:'#000',
    fontWeight: "bold",
    fontSize: 30,
    textAlign:'center',
    marginBottom: 20,
  },

//מיקום
  textWhiteLocation:{
    color:'#fff',
    fontWeight: "bold",
    fontSize: 30,
    textAlign:'center',
  },

  textBlackLocation:{
    color:'#000',
    fontWeight: "bold",
    fontSize: 30,
    textAlign:'center',
  },

  //תמונת רקע
  backgroundImg: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  top: {
    flex:0.333,
    justifyContent: 'center',
  },

//מדינה
  textWhiteCountry:{
    color:'#fff',
    fontSize: 30,
    //marginLeft: 70,
    marginTop: 10,
    fontWeight: "bold",
    opacity: 0.7,
    textAlign: 'center',
    // alignItems: "center",
    // justifyContent: 'center',
  },

  textBlackCountry:{
    color:'#000',
    fontSize: 25,
    //marginLeft: 70,
    marginTop: 10,
    fontWeight: "bold",
    opacity: 0.7,
    textAlign: 'center',
  },

 //חלק אמצעי
  middle:{
    flex:0.333,
    flexDirection:'row',
  },
  
  img:{
    flex:0.5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

//תיאור מזג האוויר
  textWhiteWeatherImage:{
    fontSize: 25,
    color:'#fff',
    fontWeight: "bold",
  },

  textBlackWeatherImage:{
    fontSize: 25,
    color:'#000',
    fontWeight: "bold",
  },

  temp:{
    flex:0.5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  //טמפרטורה
  textWhiteTemp:{
    fontSize: 50,
    fontWeight: "bold",
    color:'#fff',
  },

  textBlackTemp:{
    fontSize: 50,
    fontWeight: "bold",
    color:'#000',
  },

  //חלק תחתון
  bottom:{
    flex:0.333,
    flexDirection:'row',
  },

  textWhiteBottom:{
    color:'#fff',
    fontSize:25,
  },

  textBlackBottom:{
    color:'#fff',
    fontSize:25,
  },

  bottomLeft:{
    flex:0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomRight:{
    flex:0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

//טמפרטורה תחתונה
  bottomTempText:{
    fontSize:30,
    fontWeight: "bold",
  },
});
