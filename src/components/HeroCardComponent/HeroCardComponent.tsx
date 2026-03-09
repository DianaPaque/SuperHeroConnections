import { useState } from "react"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface HeroCardProps {
    hero: any
    onPress?: (hero: any) => void
}

export default function HeroCardComponent({ hero, onPress }: HeroCardProps) {
    console.log("Imagen URL:", hero.name, hero.image?.url)

    const [imagenError, setImagenError] = useState(false)

    const editorial = hero.biography?.publisher || "Desconocido"

    const editorialColor =
        editorial.toLowerCase().includes("marvel") ? "#dc2626" :
            editorial.toLowerCase().includes("dc") ? "#2563eb" :
                "#9333ea"

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress?.(hero)}
            activeOpacity={0.8}
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

            </View>

        </TouchableOpacity>
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
    }

})