import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface HeroCardProps {
    hero: any
}

export default function HeroCardComponent({ hero }: HeroCardProps) {
    console.log("Imagen URL:", hero.name, hero.image?.url)

    const [imagenError, setImagenError] = useState(false)
    const [esFavorito, setEsFavorito] = useState(false)

    const editorial = hero.biography?.publisher || "Desconocido"

    const editorialColor =
        editorial.toLowerCase().includes("marvel") ? "#dc2626" :
            editorial.toLowerCase().includes("dc") ? "#2563eb" :
                "#9333ea"

    const agregarEliminarFavorito = async () => {
        try {
            const datos = await AsyncStorage.getItem("favoritos")
            const favoritos = datos ? JSON.parse(datos) : []

            if (esFavorito) {
                const nuevos = favoritos.filter((f: any) => f.id !== hero.id)
                await AsyncStorage.setItem("favoritos", JSON.stringify(nuevos))
                setEsFavorito(false)
            } else {
                favoritos.push(hero)
                await AsyncStorage.setItem("favoritos", JSON.stringify(favoritos))
                setEsFavorito(true)
            }
        } catch (e) {
            console.log("Error:", e)
        }
    }

    useEffect(() => {
        const verificar = async () => {
            try {
                const datos = await AsyncStorage.getItem("favoritos")
                const favoritos = datos ? JSON.parse(datos) : []
                setEsFavorito(favoritos.some((f: any) => f.id === hero.id))
            } catch (e) {
                console.log("Error:", e)
            }
        }
        verificar()
    }, [hero.id])

    return (
        <View
            style={styles.card}
        >
            <View style={styles.contenedorImagen}>

                <Image
                    source={{ uri: hero.image?.url }}
                    style={styles.image}
                    resizeMode="cover"
                    onError={() => setImagenError(true)}
                />

                {imagenError && (
                    <View style={styles.placeholder}>
                        <Text style={styles.iniciales}>
                            {hero.name?.charAt(0) || "?"}
                        </Text>
                    </View>
                )}

            </View>

            <View style={styles.info}>

                <Text style={styles.name} numberOfLines={1}>
                    {hero.name}
                </Text>

                <Text style={styles.realName} numberOfLines={1}>
                    {hero.biography?.["full-name"] || "Nombre desconocido"}
                </Text>

                <View style={[styles.etiqueta, { backgroundColor: editorialColor }]}>
                    <Text style={styles.etiquetaTexto} numberOfLines={1}>
                        {editorial}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.botonFavorito, esFavorito && styles.botonFavoritoActivo]}
                    onPress={agregarEliminarFavorito}
                >
                    <Text style={styles.textoFavorito}>
                        {esFavorito ? "★ Guardado" : "☆ Favorito"}
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    card: {
        flexDirection: "row",
        backgroundColor: "#111827",
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#1f2937"
    },

    contenedorImagen: {
        width: 100,
        height: 120
    },

    image: {
        width: 100,
        height: 120
    },

    placeholder: {
        width: 100,
        height: 120,
        backgroundColor: "#1f2937",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute"
    },

    iniciales: {
        color: "#6b7280",
        fontSize: 36,
        fontWeight: "bold"
    },

    info: {
        flex: 1,
        padding: 14,
        justifyContent: "center",
        gap: 6
    },

    name: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },

    realName: {
        color: "#9ca3af",
        fontSize: 13
    },

    etiqueta: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 4
    },

    etiquetaTexto: {
        color: "white",
        fontSize: 11,
        fontWeight: "600"
    },

    botonFavorito: {
        backgroundColor: "#1f2937",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: "flex-start",
        borderWidth: 1,
        borderColor: "#374151",
        marginTop: 4
    },

    botonFavoritoActivo: {
        backgroundColor: "#854d0e",
        borderColor: "#ca8a04"
    },

    textoFavorito: {
        color: "white",
        fontSize: 12,
        fontWeight: "600"
    }

})