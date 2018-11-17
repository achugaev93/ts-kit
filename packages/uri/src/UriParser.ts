import {Parser, StringPool} from '@monument/core';
import {UriComponents} from './UriComponents';
import {QueryParameters} from './QueryParameters';
import {UriFormatException} from './UriFormatException';
import {UriConstants} from './UriConstants';
import {UriComponentsNormalizer} from './UriComponentsNormalizer';

/**
 * @author Alex Chugaev
 * @since 0.0.1
 */
export class UriParser implements Parser<UriComponents> {
    public canParse(source: string): boolean {
        return UriConstants.URI_PATTERN.test(source);
    }

    public parse(source: string): UriComponents {
        const parts: RegExpExecArray | null = UriConstants.URI_PATTERN.exec(source);

        if (parts == null) {
            throw new UriFormatException(`URI has invalid format`);
        }

        const schema: string | undefined = parts[UriConstants.SCHEMA_COMPONENT_INDEX];
        const userName: string | undefined = parts[UriConstants.USER_NAME_COMPONENT_INDEX];
        const password: string | undefined = parts[UriConstants.PASSWORD_COMPONENT_INDEX];
        const host: string | undefined = parts[UriConstants.HOST_COMPONENT_INDEX];
        const port: string | undefined = parts[UriConstants.PORT_COMPONENT_INDEX];
        const path: string | undefined = parts[UriConstants.PATH_COMPONENT_INDEX];
        const search: string = parts[UriConstants.SEARCH_COMPONENT_INDEX] || StringPool.BLANK;
        const fragment: string | undefined = parts[UriConstants.FRAGMENT_COMPONENT_INDEX];

        return new UriComponentsNormalizer().normalize({
            schema,
            userName,
            password,
            host,
            port: port ? parseInt(port, 10) : undefined,
            path: path || UriConstants.PATH_FRAGMENT_DELIMITER,
            queryParameters: new QueryParameters(search),
            fragment
        });
    }
}
