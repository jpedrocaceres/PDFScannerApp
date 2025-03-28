import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import PDFLib from 'react-native-pdf-lib';

export default function ScanScreen() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Desculpe, precisamos de permissão para acessar a câmera!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const addPage = async () => {
    Alert.alert(
      "Adicionar Página",
      "Escolha como adicionar uma nova página",
      [
        {
          text: "Tirar Foto",
          onPress: takePhoto
        },
        {
          text: "Escolher da Galeria",
          onPress: pickImage
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };

  const savePDF = async () => {
    if (images.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos uma página antes de salvar o PDF');
      return;
    }

    try {
      console.log('Iniciando processo de salvamento do PDF...');
      
      // Verificar permissões de armazenamento
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('Status da permissão:', cameraStatus);
      
      if (cameraStatus !== 'granted') {
        Alert.alert('Erro', 'Precisamos de permissão para acessar a câmera');
        return;
      }

      // Criar diretório temporário
      const tempDir = `${FileSystem.cacheDirectory}pdf_temp/`;
      console.log('Diretório temporário:', tempDir);
      
      const dirInfo = await FileSystem.getInfoAsync(tempDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
      }

      // Criar novo documento PDF
      const pdfPath = `${FileSystem.documentDirectory}documento_${Date.now()}.pdf`;
      console.log('Caminho do PDF:', pdfPath);

      try {
        // Criar primeira página do PDF
        const page = PDFLib.PDFPage
          .create()
          .setMediaBox(595.28, 841.89); // Tamanho A4

        console.log('Página inicial criada');

        // Criar documento PDF
        const pdfDoc = await PDFLib.PDFDocument
          .create(pdfPath)
          .addPages([page])
          .write();

        console.log('PDF base criado:', pdfDoc);

        // Adicionar cada imagem como uma nova página
        for (let i = 0; i < images.length; i++) {
          const imageUri = images[i];
          console.log(`Processando imagem ${i + 1}:`, imageUri);

          try {
            // Copiar imagem para o PDF
            const newPage = PDFLib.PDFPage
              .create()
              .setMediaBox(595.28, 841.89)
              .drawImage(imageUri, {
                x: 0,
                y: 0,
                width: 595.28,
                height: 841.89,
              });

            await PDFLib.PDFDocument
              .modify(pdfPath)
              .addPages([newPage])
              .write();

            console.log(`Imagem ${i + 1} adicionada com sucesso`);
          } catch (imageError) {
            console.error(`Erro ao processar imagem ${i + 1}:`, imageError);
            throw imageError;
          }
        }

        console.log('PDF gerado com sucesso');

        // Verificar se o arquivo foi criado
        const pdfInfo = await FileSystem.getInfoAsync(pdfPath);
        console.log('Informações do PDF:', pdfInfo);

        if (pdfInfo.exists) {
          // Compartilhar o PDF
          if (await Sharing.isAvailableAsync()) {
            console.log('Iniciando compartilhamento...');
            await Sharing.shareAsync(pdfPath, {
              mimeType: 'application/pdf',
              dialogTitle: 'Salvar PDF',
              UTI: 'com.adobe.pdf'
            });
            console.log('Compartilhamento concluído');
          } else {
            console.log('Compartilhamento não disponível');
            Alert.alert('Erro', 'Compartilhamento não está disponível neste dispositivo');
          }
        } else {
          throw new Error('PDF não foi criado corretamente');
        }
      } catch (pdfError) {
        console.error('Erro ao criar/modificar PDF:', pdfError);
        throw pdfError;
      }

      // Limpar arquivos temporários
      console.log('Limpando arquivos temporários...');
      const tempDirInfo = await FileSystem.getInfoAsync(tempDir);
      if (tempDirInfo.exists) {
        await FileSystem.deleteAsync(tempDir, { idempotent: true });
      }
      console.log('Processo concluído com sucesso');
    } catch (error) {
      console.error('Erro detalhado ao salvar PDF:', error);
      Alert.alert(
        'Erro ao Salvar PDF',
        'Não foi possível salvar o PDF. Por favor, tente novamente.'
      );
    }
  };

  const removePage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Escanear Documento</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {images.length === 0 ? (
          <View style={styles.placeholder}>
            <MaterialIcons name="document-scanner" size={64} color="#ccc" />
            <Text style={styles.placeholderText}>
              Nenhum documento selecionado
            </Text>
          </View>
        ) : (
          images.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.preview} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removePage(index)}
              >
                <MaterialIcons name="delete" size={24} color="#ff4444" />
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.cameraButton]}
            onPress={takePhoto}
          >
            <MaterialIcons name="camera-alt" size={24} color="#fff" />
            <Text style={styles.buttonText}>Tirar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.galleryButton]}
            onPress={pickImage}
          >
            <MaterialIcons name="photo-library" size={24} color="#fff" />
            <Text style={styles.buttonText}>Escolher da Galeria</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.addButton]}
                onPress={addPage}
              >
                <MaterialIcons name="add" size={24} color="#fff" />
                <Text style={styles.buttonText}>Adicionar Página</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={savePDF}
              >
                <MaterialIcons name="save" size={24} color="#fff" />
                <Text style={styles.buttonText}>Salvar PDF</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  preview: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 5,
  },
  placeholder: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    gap: 15,
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  cameraButton: {
    backgroundColor: '#2196F3',
  },
  galleryButton: {
    backgroundColor: '#4CAF50',
  },
  addButton: {
    backgroundColor: '#FF9800',
  },
  saveButton: {
    backgroundColor: '#9C27B0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 