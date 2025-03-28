import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleScanPress = () => {
    // TODO: Implementar navegação para a tela de scanner
    router.push('/scan');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PDF Scanner</Text>
        <Text style={styles.subtitle}>Digitalize seus documentos facilmente</Text>
      </View>

      <TouchableOpacity 
        style={styles.scanButton}
        onPress={handleScanPress}
      >
        <MaterialIcons name="document-scanner" size={48} color="#fff" />
        <Text style={styles.buttonText}>Escanear Documento</Text>
      </TouchableOpacity>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.featureText}>Alta qualidade</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.featureText}>Processamento rápido</Text>
        </View>
        <View style={styles.featureItem}>
          <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
          <Text style={styles.featureText}>Exportação em PDF</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 150,
    marginBottom: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  featuresContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
}); 