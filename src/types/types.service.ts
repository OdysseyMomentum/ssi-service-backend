import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CredentialType } from './credential-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/organization.entity';
import { JolocomCredentialType } from 'src/connectors/jolocom/jolocom-credential-type.entity';
import { IndySchema } from 'src/connectors/indy/indy-schema.entity';

interface CreateData {
  organizationId: number | string;
  jolocomCredentialTypeId?: number | string;
  indySchemaId?: number | string;
  irmaType: string;
  type: string;
}

@Injectable()
export class TypesService {
  constructor(
    @InjectRepository(CredentialType)
    private typesRespository: Repository<CredentialType>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @InjectRepository(JolocomCredentialType)
    private jolocomTypeRepository: Repository<JolocomCredentialType>,
    @InjectRepository(IndySchema)
    private indySchemasRepository: Repository<IndySchema>,
  ) {}

  async findAll() {
    return this.typesRespository.find({
      relations: ['organization', 'jolocomType'],
    });
  }

  async create({
    organizationId,
    jolocomCredentialTypeId,
    indySchemaId,
    irmaType,
    type,
  }: CreateData) {
    const organization = await this.organizationsRepository.findOneOrFail(
      organizationId,
    );
    const jolocomCredentialType = jolocomCredentialTypeId
      ? await this.jolocomTypeRepository.findOneOrFail(jolocomCredentialTypeId)
      : null;
    const indySchema = indySchemaId
      ? await this.indySchemasRepository.findOneOrFail(indySchemaId)
      : null;

    const credentialType = new CredentialType();

    credentialType.type = type;
    credentialType.irmaType = irmaType;
    credentialType.organization = organization;
    credentialType.jolocomType = jolocomCredentialType;
    credentialType.indySchema = indySchema;

    return this.typesRespository.save(credentialType);
  }
}
