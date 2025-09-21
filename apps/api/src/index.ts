import config from './config/config';
import app from './app';

const PORT = config.port;

const start = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
