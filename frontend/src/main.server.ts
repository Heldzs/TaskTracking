import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/components/appComponent/app';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(App, config);

export default bootstrap;
