import axios from "axios"
import { useRouter } from "expo-router"
import { useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import HeroCardComponent from "../HeroCardComponent/HeroCardComponent"

const HEROES_POPULARES = [
    "Batman", "Spider-Man", "Superman", "Wonder Woman",
    "Iron Man", "Thor", "Hulk", "Captain America"
]

export default function HeroApiComponent() {

    const router = useRouter()
    const [data, setData] = useState<any[]>([])
    const [consulta, setConsulta] = useState("")
    const [cargando, setCargando] = useState(false)
    const [buscado, setBuscado] = useState(false)
    const [error, setError] = useState("")

    const baseUrl = process.env.EXPO_PUBLIC_SUPERHERO_API

    const buscarHeroe = async (nombre: string) => {
        if (!nombre.trim()) return
        setCargando(true)
        setError("")
        setBuscado(true)

        try {
            const respuesta = await axios.get(`${baseUrl}/search/${nombre.trim()}`)

            if (respuesta.data.response === "success" && respuesta.data.results) {
                setData(respuesta.data.results)
            } else {
                setData([])
                setError(`No se encontró "${nombre}"`)
            }
        } catch (err) {
            setData([])
            setError("Error al conectar con la API")
        } finally {
            setCargando(false)
        }
    }

    const alPresionarHeroe = (heroe: any) => {
        router.push({ pathname: "../hero/[id]", params: { id: heroe.id } })
    }

    const renderizarVacio = () => {
        if (cargando) return null
        if (error) return (
            <View style={styles.contenedorVacio}>
                <Text style={styles.textoVacio}>{error}</Text>
            </View>
        )
        if (!buscado) return (
            <View style={styles.contenedorVacio}>
                <Text style={styles.textoVacio}>Busca un superhéroe por nombre</Text>
                <Text style={styles.textoSecundario}>Prueba con: Batman, Spider-Man, Thor...</Text>
            </View>
        )
        return (
            <View style={styles.contenedorVacio}>
                <Text style={styles.textoVacio}>Sin resultados</Text>
            </View>
        )
    }

    return (
        <View style={styles.contenedor}>

            <View style={styles.encabezado}>
                <Text style={styles.titulo}>Buscar Superhéroes</Text>
            </View>

            <View style={styles.contenedorBusqueda}>
                <TextInput
                    style={styles.input}
                    placeholder="Ej: Batman, Spider-Man..."
                    placeholderTextColor="#6b7280"
                    value={consulta}
                    onChangeText={setConsulta}
                    onSubmitEditing={() => buscarHeroe(consulta)}
                    returnKeyType="search"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    style={styles.botonBuscar}
                    onPress={() => buscarHeroe(consulta)}
                >
                    <Text style={styles.textoBuscar}>Buscar</Text>
                </TouchableOpacity>
            </View>

            {!buscado && (
                <View style={styles.contenedorChips}>
                    {HEROES_POPULARES.map((heroe) => (
                        <TouchableOpacity
                            key={heroe}
                            style={styles.chip}
                            onPress={() => {
                                setConsulta(heroe)
                                buscarHeroe(heroe)
                            }}
                        >
                            <Text style={styles.textoChip}>{heroe}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {data.length > 0 && (
                <Text style={styles.contadorResultados}>
                    {data.length} resultado{data.length !== 1 ? "s" : ""} para "{consulta}"
                </Text>
            )}

            {cargando && (
                <View style={styles.contenedorCarga}>
                    <ActivityIndicator size="large" color="#2563eb" />
                    <Text style={styles.textoCarga}>Buscando héroes...</Text>
                </View>
            )}

            {!cargando && (
                <FlatList
                    data={data}
                    renderItem={({ item }) => (
                        <HeroCardComponent hero={item} onPress={alPresionarHeroe} />
                    )}
                    keyExtractor={(item) => item.id?.toString()}
                    ListEmptyComponent={renderizarVacio}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={data.length === 0 ? { flex: 1 } : { paddingBottom: 20 }}
                />
            )}

        </View>
    )
}

const styles = StyleSheet.create({

    contenedor: {
        flex: 1,
        backgroundColor: "black"
    },

    encabezado: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10
    },

    titulo: {
        color: "white",
        fontSize: 28,
        fontWeight: "bold"
    },

    contenedorBusqueda: {
        flexDirection: "row",
        marginHorizontal: 16,
        marginBottom: 16,
        gap: 10
    },

    input: {
        flex: 1,
        backgroundColor: "#111827",
        color: "white",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#1f2937"
    },

    botonBuscar: {
        backgroundColor: "#2563eb",
        borderRadius: 12,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center"
    },

    textoBuscar: {
        color: "white",
        fontWeight: "bold",
        fontSize: 15
    },

    contenedorChips: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
        gap: 8,
        marginBottom: 20
    },

    chip: {
        backgroundColor: "#1f2937",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#374151"
    },

    textoChip: {
        color: "#9ca3af",
        fontSize: 13
    },

    contadorResultados: {
        color: "#6b7280",
        fontSize: 13,
        marginHorizontal: 20,
        marginBottom: 8
    },

    contenedorCarga: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12
    },

    textoCarga: {
        color: "#6b7280",
        fontSize: 15
    },

    contenedorVacio: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        paddingBottom: 60
    },

    iconoVacio: {
        fontSize: 48
    },

    textoVacio: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center"
    },

    textoSecundario: {
        color: "#6b7280",
        fontSize: 14,
        textAlign: "center"
    }

})