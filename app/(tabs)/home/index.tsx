import { useRouter } from "expo-router"
import React from "react"
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function HomeScreen(): JSX.Element {

    const router = useRouter()

    return (

        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.header}>

                <Image
                    source={require("../../../assets/images/superherologo.png")}
                    style={styles.logo}
                />

                <Text style={styles.title}>
                    Superhero Connections
                </Text>

            </View>

            <Text style={styles.description}>
                Explora relaciones entre superhéroes, descubre aliados,
                equipos y enemigos en un mapa interactivo.
            </Text>

            <TouchableOpacity
                style={[styles.button, styles.blue]}
                onPress={() => router.push("/(tabs)/search")}
            >
                <Text style={styles.buttonText}>
                    Buscar Superhéroes
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.purple]}
                onPress={() => router.push("/(tabs)/map")}
            >
                <Text style={styles.buttonText}>
                    Mapa Interactivo
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.red]}>
                <Text style={styles.buttonText}>
                    Favoritos
                </Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },

    header: {
        alignItems: "center",
        marginBottom: 30
    },

    logo: {
        width: 90,
        height: 90,
        marginBottom: 10
    },

    title: {
        color: "white",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center"
    },

    description: {
        color: "#9ca3af",
        textAlign: "center",
        marginBottom: 40,
        fontSize: 16,
        maxWidth: 320
    },

    button: {
        width: "100%",
        padding: 18,
        borderRadius: 15,
        marginBottom: 15
    },

    blue: {
        backgroundColor: "#2563eb"
    },

    purple: {
        backgroundColor: "#9333ea"
    },

    red: {
        backgroundColor: "#dc2626"
    },

    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    }

})