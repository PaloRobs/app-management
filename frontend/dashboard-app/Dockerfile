# Stage 1: Build dell'applicazione
FROM node:18-alpine AS builder

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia i file di configurazione per i pacchetti
COPY package.json package-lock.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dei file dell'applicazione
COPY . .

# Compila l'applicazione per la produzione
RUN npm run build

# Stage 2: Serve l'applicazione con Nginx
FROM nginx:1.23-alpine

# Modifica qui:
# Copia il contenuto della cartella 'dist' (creata da Vite)
COPY --from=builder /app/dist /usr/share/nginx/html

# Espone la porta predefinita di Nginx
EXPOSE 80

# Avvia Nginx in modalità foreground
CMD ["nginx", "-g", "daemon off;"]