import { Controller, Post, Body, Param } from '@nestjs/common';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { UtilsService } from './utils.service';

@Controller('api/utils')
export class UtilsController {
  constructor(
    private organizationsService: OrganizationsService,
    private utilsService: UtilsService,
  ) {}

  @Post('jwt/:organizationId')
  async generateJwt(
    @Param('organizationId') organizationId: string,
    @Body() body: string | object,
  ) {
    // TODO: move into utilsService
    const organization = await this.organizationsService.find(organizationId);
    const jwt = this.utilsService.createSignedJwt(body, organization);
    return jwt;
  }
}
