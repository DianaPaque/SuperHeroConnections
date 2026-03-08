import HeroApiComponent from "@/src/components/HeroApiComponent/HeroApiComponent"
import { SafeAreaView } from "react-native-safe-area-context"

export default function SearchScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <HeroApiComponent />
        </SafeAreaView>
    )
}