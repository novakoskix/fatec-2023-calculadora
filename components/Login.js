import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Alert, Platform} from 'react-native';
import logo from "../assets/ADS.png"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as LocalAuthentication from "expo-local-authentication"

export default function Login() {
	const [suporteBiometria, setSuporteBiometria] = useState(false)
	// Verificando se o aparelho tem suporte a biometria
	useEffect(()=> {
		(async()=> {
			const temSuporte = await LocalAuthentication.hasHardwareAsync()
			setSuporteBiometria(temSuporte)
		})
	})
	/**
 *  Cria um alerta que funciona tanto para mobile quanto para web
 *  @param {string} titulo Titulo da Mensagem
 *  @param {string} mensagem Conteúdo que será exibido
 *  @param {string} btnTxt Texto que será direcionado
 *  @param {string} btnFunc Função que será direcionado
 *  @return {Alert} Retorna o alerta correto
*/

    const alerta = (titulo, mensagem, btnTxt, btnFunc) => {
        if(Platform.OS === 'web'){
            return alert(`${titulo} \n ${mensagem}`)
        } else {
            return Alert.alert(titulo, mensagem, [
                {
                    text: btnTxt,
                    onPress: btnFunc
                }
            ])
        }
    }
	/*
	*Efetua o login biometrico efetuando as validações
	*/
	const loginBiometrico = async() =>{
		//o hardware suporta biometria?
		const biometriaDisponivel = await
		LocalAuthentication.hasHardwareAsync()
		//Se a biometria não estiver disponivel
		if (!biometriaDisponivel)
		return alerta("Erro","❌ Autenticação Biométrica não disponível","OK",()=>fallBackToDefaultLogin())
		//VErificamos os tipos de biometria disponiveis
		//1-finger 2-face 3-Íris
		let biometriaSuportadas
		if (biometriaDisponivel)
			biometriaSuportadas = await LocalAuthentication.supportedAuthenticationTypesAsync()
		//Verifica se os dados biometricos estão salvos	
		const biometriaSalva = await LocalAuthentication.
		isEnrolledAsync()
		if(!biometriaSalva)
		return alerta(
		'Por favor, efetue o login da forma tradicional', 'ok',
		()=> fallBackToDefaultLogin()
		)
		// Autentica o usuário com a biometria
		const autenticaBiometria = await LocalAuthentication.
		authenticateAsync({
			promptMessage: 'Efetue o login com a Biometria',
			cancelLabel: 'Cancelar',
			disableDeviceFallback: false // desabilita o Teclado PIN
		})
		//Em caso de sucesso faremos o login
		if(autenticaBiometria.success){
			return alerta("👍 tudo certo!!", 
			"Você será direcionado para a área reservada", "ok")
		}
	}
	const fallBackToDefaultLogin=()=>{
		console.log('Não foi possivel fazer o login biométrico')
		console.log('Implemente o login tradicional')
	}
	return (
		<View style={styles.container}>
			<StatusBar style="auto" backgroundColor="#931610"/>
			<Image
				source={logo}
				resizeMode={'contain'} // Cover or Contain
				style={{
					width: Dimensions.get("window").width * .5,
					height: Dimensions.get("window").height * .5
				}}/>
			<Text style={styles.titulo}>Fatec Cripto {suporteBiometria}</Text>

			<TouchableOpacity style={styles.finger}>
				<MaterialCommunityIcons name={suporteBiometria ?"fingerprint" :"fingerprint-off"} size={72} color="#931610"/>
			</TouchableOpacity>
			{suporteBiometria
				?<Text style={styles.legenda}>Desbloqueie o seu Dispositivo</Text>
				:<>
					<Text style={styles.legenda}>Dispositivo não possui suporte a biometria</Text>
					<MaterialCommunityIcons.Button name="login" size={32} color="#931610" backgroundColor="#FFFFFF"
					onPress={() =>alerta('Acesso', 'Aguarde, enquanto lhe direcionamos para o login')}
					> Login</MaterialCommunityIcons.Button>
				</>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#BBBBBB",
		alignItems: "center",
		justifyContent: "center"
	},
	titulo: {
		fontSize: 24,
		fontWeight: "400",
		color: "#931610"
	},
	finger:{
		marginTop:  16,	
		padding: 32,
		borderRadius:16,
		backgroundColor: "#FFFFFF",
		shadowColor: "#931610",
		// Sombras para o IOS
		shadowOffset: {width: 5, height: 5},
		shadowOpacity: 0.7,
		// Sombras para o Android
		elevation: 8
	},
	legenda: {
		marginTop: 8,
		fontSize: 11,
		fontWeight: "300",
		color: "#3E535C"
	}
})