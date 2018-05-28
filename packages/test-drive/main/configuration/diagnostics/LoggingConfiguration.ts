import {Configuration} from '@monument/decorators/main/stereotype/Configuration';
import {Unit} from '@monument/decorators/main/stereotype/Unit';
import {LoggerConfiguration} from '@monument/logger/main/logger/LoggerConfiguration';
import {ConsoleAppender} from '@monument/logger/main/appender/console/ConsoleAppender';
import {ConsoleMessageLayout} from '@monument/logger/main/appender/console/ConsoleMessageLayout';


@Configuration
export class LoggingConfiguration {

    @Unit(LoggerConfiguration)
    public loggerConfiguration(): LoggerConfiguration {
        return new LoggerConfiguration([
            this.getMainAppender()
        ]);
    }


    private getMainAppender() {
        return new ConsoleAppender(ConsoleMessageLayout.SIMPLE);
    }
}
