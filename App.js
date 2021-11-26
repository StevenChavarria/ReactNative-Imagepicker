import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform} from 'react-native';
import Logo from './assets/300Logo.png';
import * as ImagePicker from 'expo-image-picker'
import * as Sharing from 'expo-sharing'
import uploadToAnonymousFileAsync from 'anonymous-files';
import * as SplashScreen from 'expo-splash-screen';


export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePicker = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    //recordar eliminar estas lineas despues de probar el splash screen
    SplashScreen.preventAutoHideAsync();
    setTimeout(SplashScreen.hideAsync, 5000);
    
  
    if (permissionResult.granted === false) {
      alert('Permission to access camera rol is required');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log(pickerResult);

    if (pickerResult.cancelled == true) {
      return;
    }

    if(Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFileAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    }else{
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
    
  }

  let openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }
    await Sharing.shareAsync(selectedImage.localUri);
  };

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage.localUri }} style={styles.thumbnail} />
        <TouchableOpacity onPress={openShareDialogAsync} style={styles.button}>
          <Text style={styles.buttonText}>Share this photo</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo}></Image>
      <Text style={styles.instructions}>Share a photo with a friend </Text>
      <TouchableOpacity onPress={openImagePicker} style={styles.button}>
        <Text style={styles.buttonText}>
          Pick a photo
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 305,
    height: 220
  },
  instructions: {
    color: '#888',
    fontSize: 13
  },
  button: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff'
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain'
  },
});
