import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import HeroCardComponent from "../HeroCardComponent/HeroCardComponent"

export default function FavoritesComponent() {

    const [favoritos, setFavoritos] = useState<any[]>([])

    useFocusEffect(
        useCallback(() => {
            const cargar = async () => {
                try {
                    const datos = await AsyncStorage.getItem("favoritos")
                    if (datos) setFavoritos(JSON.parse(datos))
                    else setFavoritos([])
                } catch (e) {
                    console.log("Error:", e)
                }
            }
            cargar()
        }, [])
    )

    const renderVacio = () => (
        <View style={styles.contenedorVacio}>
            <Text style={styles.textoVacio}>No tienes favoritos aún</Text>
            <Text style={styles.textoSecundario}>
                Busca un héroe y toca "☆ Favorito"
            </Text>
        </View>
    )

    return (
        <View style={styles.contenedor}>

            <View style={styles.encabezado}>
                <Text style={styles.titulo}>Favoritos</Text>
                <Text style={styles.contador}>
                    {favoritos.length} héroe{favoritos.length !== 1 ? "s" : ""}
                </Text>
            </View>

            <FlatList
                data={favoritos}
                renderItem={({ item }) => <HeroCardComponent hero={item} />}
                keyExtractor={(item) => item.id?.toString()}
                ListEmptyComponent={renderVacio}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={
                    favoritos.length === 0 ? { flex: 1 } : { paddingBottom: 20 }
                }
            />

        </View>
    )
}

const styles = StyleSheet.create({

    contenedor: {
        flex: 1,
        backgroundColor: "black"
    },

    encabezado: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10
    },

    titulo: {
        color: "white",
        fontSize: 28,
        fontWeight: "bold"
    },

    contador: {
        color: "#6b7280",
        fontSize: 14
    },

    contenedorVacio: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        paddingBottom: 60
    },

    textoVacio: {
        color: "white",
        fontSize: 18,
        fontWeight: "600"
    },

    textoSecundario: {
        color: "#6b7280",
        fontSize: 14,
        textAlign: "center"
    }

})