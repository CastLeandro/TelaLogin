import {View, Text, Button } from 'react-native';
import { Link } from 'expo-router';


export default function home(){
    return(
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Home</Text>
      <Link href="/" asChild>
        <Button title="Ir para Login" />
      </Link>
    </View>
    );
}