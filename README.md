# Developing Applications with Google Cloud: Storing Application Data

## Tarea 1: Configurar el entorno

1. **Visitar la página de instalación del SDK de Google Cloud:**
   - Abre el siguiente enlace para acceder a la página de instalación del SDK de Google Cloud: [Google Cloud SDK - Documentación de instalación](https://cloud.google.com/sdk/docs/install?hl=es-419)

2. **Instalación en Windows:**
   - Abre **PowerShell** con permisos de administrador.
   - Ejecuta el siguiente comando para descargar e instalar el SDK de Google Cloud:

     ```powershell
     (New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
     & $env:Temp\GoogleCloudSDKInstaller.exe
     ```

   - Deja todos los ajustes por defecto durante la instalación.

3. **Instalación en otros sistemas operativos:**
   - Sigue las instrucciones específicas en la página mencionada anteriormente según tu sistema operativo.

4. **Verificar la instalación:**
   - Una vez completada la instalación, verifica que se haya instalado correctamente ejecutando el siguiente comando en la terminal o PowerShell:

     ```bash
     gcloud --version
     ```

5. **Autenticación en Google Cloud:**
   - Desde PowerShell (o la terminal de tu sistema), inicia sesión en tu cuenta de Google ejecutando:

     ```bash
     gcloud auth login
     ```

   - Selecciona tu cuenta de Google y confirma los permisos cuando se te solicite.

6. **Inicializar la configuración de gcloud:**
   - Ejecuta el siguiente comando para inicializar la configuración:

     ```bash
     gcloud init
     ```

   - Selecciona la opción para inicializar con la configuración por defecto.
   - Elige la cuenta con la que te has autenticado previamente.
   - Selecciona el proyecto en el que vas a trabajar.
