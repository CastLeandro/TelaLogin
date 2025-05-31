import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
    title: string;
    onPress: () => void;
}

export default function CustomButton({title, onPress}: Props){
    return( 
        <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.text}> {title}</Text>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#0066cc',
        padding: 12,
        borderRadius: 8,
        margin:10,
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        
    }
})