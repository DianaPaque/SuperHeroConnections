import React, { useState } from "react"
import { ActivityIndicator, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg"

const { width, height } = Dimensions.get("window")
const CENTRO_X = width / 2
const CENTRO_Y = height / 2.5
const RADIO = 150

const COLORES_CONEXION: Record<string, string> = {
    "grupo": "#2563eb",
    "familiar": "#9333ea",
    "aliado": "#16a34a",
    "enemigo": "#dc2626"
}

const HEROES_POPULARES = ["Batman", "Spider-Man", "Iron Man", "Superman", "Wonder Woman", "Thor"]

const ENEMIGOS: Record<string, string[]> = {
    "Batman": ["Joker", "Bane", "Penguin", "Ra's al Ghul"],
    "Spider-Man": ["Venom", "Green Goblin", "Doctor Octopus", "Sandman"],
    "Superman": ["Lex Luthor", "Doomsday", "Brainiac", "Zod"],
    "Iron Man": ["Mandarin", "Whiplash", "Ultron", "Justin Hammer"],
    "Thor": ["Loki", "Hela", "Thanos", "Surtur"],
    "Wonder Woman": ["Ares", "Cheetah", "Circe", "Giganta"],
    "Hulk": ["Abomination", "Leader", "Red Hulk", "Thunderbolt Ross"],
    "Captain America": ["Red Skull", "Crossbones", "Baron Zemo", "MODOK"],
    "Flash": ["Reverse Flash", "Captain Cold", "Gorilla Grodd", "Zoom"],
    "Aquaman": ["Black Manta", "Ocean Master", "Corum Rath", "Dead King"],
    "Black Panther": ["Killmonger", "Klaw", "M'Baku", "Namor"],
    "Doctor Strange": ["Dormammu", "Mordo", "Nightmare", "Shuma-Gorath"],
    "Wolverine": ["Sabretooth", "Magneto", "Lady Deathstrike", "Omega Red"],
    "Daredevil": ["Kingpin", "Bullseye", "Elektra", "Typhoid Mary"],
    "Green Lantern": ["Sinestro", "Parallax", "Anti-Monitor", "Black Hand"],
}

const ALIADOS: Record<string, string[]> = {
    "Batman": ["Robin", "Nightwing", "Batgirl", "Alfred"],
    "Spider-Man": ["Mary Jane", "Aunt May", "Ned Leeds", "Miles Morales"],
    "Superman": ["Lois Lane", "Jimmy Olsen", "Perry White", "Supergirl"],
    "Iron Man": ["Pepper Potts", "War Machine", "Happy Hogan", "JARVIS"],
    "Thor": ["Jane Foster", "Sif", "Volstagg", "Fandral"],
    "Wonder Woman": ["Steve Trevor", "Etta Candy", "Hippolyta", "Donna Troy"],
    "Hulk": ["Betty Ross", "Rick Jones", "She-Hulk", "Banner"],
    "Captain America": ["Bucky Barnes", "Sam Wilson", "Peggy Carter", "Nick Fury"],
    "Flash": ["Iris West", "Wally West", "Jay Garrick", "Cisco Ramon"],
    "Aquaman": ["Mera", "Vulko", "Aqualad", "Storm"],
    "Black Panther": ["Shuri", "Okoye", "Nakia", "W'Kabi"],
    "Doctor Strange": ["Wong", "Ancient One", "Clea", "Wanda Maximoff"],
    "Wolverine": ["Cyclops", "Jean Grey", "Storm", "Rogue"],
    "Daredevil": ["Foggy Nelson", "Karen Page", "Luke Cage", "Jessica Jones"],
    "Green Lantern": ["Hal Jordan", "John Stewart", "Guy Gardner", "Kyle Rayner"],
}

interface Nodo {
    id: string
    nombre: string
    tipo: "centro" | "grupo" | "familiar" | "aliado" | "enemigo"
    x: number
    y: number
}

const parsearConexiones = (conexiones: any, nombreHeroe: string): Omit<Nodo, "x" | "y" | "id">[] => {
    const nodos: Omit<Nodo, "x" | "y" | "id">[] = []

    const grupos = conexiones?.["group-affiliation"] || ""
    const familiares = conexiones?.["relatives"] || ""

    grupos.split(",").slice(0, 3).forEach((g: string) => {
        const nombre = g.trim()
        if (nombre && nombre !== "-") nodos.push({ nombre, tipo: "grupo" })
    })

    familiares.split(",").slice(0, 3).forEach((f: string) => {
        const nombre = f.trim().split("(")[0].trim()
        if (nombre && nombre !== "-") nodos.push({ nombre, tipo: "familiar" })
    })

    const nombreClave = Object.keys(ENEMIGOS).find(k =>
        nombreHeroe.toLowerCase().includes(k.toLowerCase())
    )

    if (nombreClave) {
        ENEMIGOS[nombreClave].forEach(e => nodos.push({ nombre: e, tipo: "enemigo" }))
        ALIADOS[nombreClave].forEach(a => nodos.push({ nombre: a, tipo: "aliado" }))
    }

    return nodos
}

export default function ConnectionMapComponent() {

    const [heroe, setHeroe] = useState<any>(null)
    const [nodos, setNodos] = useState<Nodo[]>([])
    const [cargando, setCargando] = useState(false)
    const [busqueda, setBusqueda] = useState("")
    const [error, setError] = useState("")
    const [mostrarBusqueda, setMostrarBusqueda] = useState(true)

    const baseUrl = process.env.EXPO_PUBLIC_SUPERHERO_API

    const buscarHeroe = async (nombre: string) => {
        if (!nombre.trim()) return
        setCargando(true)
        setError("")

        try {
            const res = await fetch(`${baseUrl}/search/${nombre.trim()}`)
            const data = await res.json()

            if (data.response === "success" && data.results?.length > 0) {
                const h = data.results[0]
                setHeroe(h)
                construirMapa(h)
                setMostrarBusqueda(false)
            } else {
                setError(`No se encontró "${nombre}"`)
            }
        } catch (e) {
            setError("Error al conectar con la API")
        } finally {
            setCargando(false)
        }
    }

    const construirMapa = (h: any) => {
        const conexiones = parsearConexiones(h.connections, h.name)
        const total = conexiones.length

        const nuevosNodos: Nodo[] = [
            {
                id: "centro",
                nombre: h.name,
                tipo: "centro",
                x: CENTRO_X,
                y: CENTRO_Y
            }
        ]

        conexiones.forEach((c, i) => {
            const angulo = (2 * Math.PI * i) / total - Math.PI / 2
            nuevosNodos.push({
                id: `${c.tipo}-${i}`,
                nombre: c.nombre,
                tipo: c.tipo,
                x: CENTRO_X + RADIO * Math.cos(angulo),
                y: CENTRO_Y + RADIO * Math.sin(angulo)
            })
        })

        setNodos(nuevosNodos)
    }

    const nodoCentro = nodos.find(n => n.tipo === "centro")
    const nodosConexion = nodos.filter(n => n.tipo !== "centro")

    return (
        <View style={styles.contenedor}>

            <View style={styles.encabezado}>
                <Text style={styles.titulo}>Mapa de Conexiones</Text>
                {!mostrarBusqueda && (
                    <TouchableOpacity
                        style={styles.botonNuevo}
                        onPress={() => setMostrarBusqueda(true)}
                    >
                        <Text style={styles.textoBotonNuevo}>Nuevo</Text>
                    </TouchableOpacity>
                )}
            </View>

            {mostrarBusqueda && (
                <View style={styles.contenedorBusqueda}>

                    <Text style={styles.instruccion}>
                        ¿Qué héroe quieres explorar?
                    </Text>

                    <View style={styles.filaBusqueda}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Batman, Spider-Man..."
                            placeholderTextColor="#6b7280"
                            value={busqueda}
                            onChangeText={setBusqueda}
                            onSubmitEditing={() => buscarHeroe(busqueda)}
                            returnKeyType="search"
                            autoCorrect={false}
                        />
                        <TouchableOpacity
                            style={styles.botonBuscar}
                            onPress={() => buscarHeroe(busqueda)}
                        >
                            <Text style={styles.textoBuscar}>Buscar</Text>
                        </TouchableOpacity>
                    </View>

                    {error !== "" && (
                        <Text style={styles.textoError}>{error}</Text>
                    )}

                    <Text style={styles.subtitulo}>Héroes populares</Text>

                    <View style={styles.contenedorChips}>
                        {HEROES_POPULARES.map(h => (
                            <TouchableOpacity
                                key={h}
                                style={styles.chip}
                                onPress={() => {
                                    setBusqueda(h)
                                    buscarHeroe(h)
                                }}
                            >
                                <Text style={styles.textoChip}>{h}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>
            )}

            {cargando && (
                <View style={styles.contenedorCarga}>
                    <ActivityIndicator size="large" color="#2563eb" />
                    <Text style={styles.textoCarga}>Construyendo mapa...</Text>
                </View>
            )}

            {!cargando && !mostrarBusqueda && nodos.length > 0 && (
                <View style={styles.contenedorMapa}>

                    <Text style={styles.nombreHeroe}>{heroe?.name}</Text>

                    <View style={styles.svgContenedor}>
                        <Svg width={width} height={height * 0.65}>

                            {nodoCentro && nodosConexion.map(nodo => (
                                <Line
                                    key={`linea-${nodo.id}`}
                                    x1={nodoCentro.x}
                                    y1={nodoCentro.y}
                                    x2={nodo.x}
                                    y2={nodo.y}
                                    stroke={COLORES_CONEXION[nodo.tipo]}
                                    strokeWidth="1.5"
                                    strokeOpacity="0.5"
                                />
                            ))}

                            {nodos.map(nodo => (
                                <React.Fragment key={nodo.id}>
                                    <Circle
                                        cx={nodo.x}
                                        cy={nodo.y}
                                        r={nodo.tipo === "centro" ? 38 : 30}
                                        fill={nodo.tipo === "centro" ? "#1d4ed8" : COLORES_CONEXION[nodo.tipo]}
                                        fillOpacity="0.9"
                                    />
                                    <Circle
                                        cx={nodo.x}
                                        cy={nodo.y}
                                        r={nodo.tipo === "centro" ? 38 : 30}
                                        fill="none"
                                        stroke={nodo.tipo === "centro" ? "#3b82f6" : COLORES_CONEXION[nodo.tipo]}
                                        strokeWidth="2"
                                        strokeOpacity="0.6"
                                    />
                                    <SvgText
                                        x={nodo.x}
                                        y={nodo.y + 4}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize={nodo.tipo === "centro" ? "9" : "7.5"}
                                        fontWeight="bold"
                                    >
                                        {nodo.nombre.length > 12
                                            ? nodo.nombre.substring(0, 12) + "..."
                                            : nodo.nombre}
                                    </SvgText>
                                </React.Fragment>
                            ))}

                        </Svg>
                    </View>

                    <View style={styles.leyenda}>
                        {Object.entries(COLORES_CONEXION).map(([tipo, color]) => (
                            <View key={tipo} style={styles.itemLeyenda}>
                                <View style={[styles.circuloLeyenda, { backgroundColor: color }]} />
                                <Text style={styles.textoLeyenda}>{tipo}</Text>
                            </View>
                        ))}
                    </View>

                </View>
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10
    },

    titulo: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold"
    },

    botonNuevo: {
        backgroundColor: "#1f2937",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#374151"
    },

    textoBotonNuevo: {
        color: "white",
        fontSize: 13
    },

    contenedorBusqueda: {
        flex: 1,
        padding: 20,
        gap: 14
    },

    instruccion: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold"
    },

    filaBusqueda: {
        flexDirection: "row",
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
        backgroundColor: "#9333ea",
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

    textoError: {
        color: "#dc2626",
        fontSize: 14
    },

    subtitulo: {
        color: "#9ca3af",
        fontSize: 14,
        marginTop: 4
    },

    contenedorChips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10
    },

    chip: {
        backgroundColor: "#1f2937",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#374151"
    },

    textoChip: {
        color: "white",
        fontSize: 14
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

    contenedorMapa: {
        flex: 1,
        alignItems: "center"
    },

    nombreHeroe: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4
    },

    svgContenedor: {
        flex: 1
    },

    leyenda: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: "#111827",
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#1f2937"
    },

    itemLeyenda: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },

    circuloLeyenda: {
        width: 10,
        height: 10,
        borderRadius: 5
    },

    textoLeyenda: {
        color: "#9ca3af",
        fontSize: 12,
        textTransform: "capitalize"
    }

})