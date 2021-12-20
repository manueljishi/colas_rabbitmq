## Sistema de colas Aplicación de Tráfico

Proceso para consumir archivos desde una cola de RabbitMQ para luego poder introducir los datos de los archivos a una base de datos de MongoDB y escribir esos datos en un fichero .json que se actualiza diariamente

### Formato de los mensajes a encolar en RabbitMQ

|  DATOS | SERVICIO QUE LO ENVIA | COMO | FECHA | DONDE |
| :------: | :---------------------: | :----: | :-----: | :-----: |
| Informacion a enviar | Coleccion donde hay que guardarlo | Parametros especiales de guardado | Fecha del envio | Datos extra |


#### TO-DO
 - Mirar en que casos se puede mandar el ack a la cola y en cuales no
