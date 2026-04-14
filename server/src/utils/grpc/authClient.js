const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// ПУТЬ К ТВОЕМУ .PROTO ФАЙЛУ (тот самый, что в общей папке proto)
// Выходим из grpc -> utils -> src -> server в корень webchat, затем в папку proto
const PROTO_PATH = path.join(__dirname, '..', '..', '..', '..', 'proto', 'auth.proto');

// Настройка загрузчика
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,      // Чтобы refresh_token не превратился в refreshToken
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

// Загружаем объект из прото-файла
const authProto = grpc.loadPackageDefinition(packageDefinition).auth;

// Создаем клиента
// 'localhost:50051' — адрес твоего Go-сервера
const client = new authProto.AuthService(
    'localhost:50051',
    grpc.credentials.createInsecure() // Без SSL (для локальной разработки)
);

// Обертки для удобного использования через async/await
const authService = {
    login: (login, password) => {
        return new Promise((resolve, reject) => {
            client.Login({ login, password }, (err, response) => {
                if (err) return reject(err);
                resolve(response);
            });
        });
    },
    register: (login, password) => {
        return new Promise((resolve, reject) => {
            client.Register({ login, password }, (err, response) => {
                if (err) return reject(err);
                resolve(response);
            });
        });
    }
};

module.exports = authService;