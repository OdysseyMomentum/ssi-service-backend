import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Generated,
  ManyToOne,
} from 'typeorm';
import { CredentialRequest } from './credential-request.interface';
import { Organization } from '../organizations/organization.entity';
import { CredentialType } from 'src/types/credential-type.entity';

export interface CredentialVerifyRequestData {
  iss: string;
  type: string;
  callbackUrl: string; // the REST api of the verifier where to deliver the credential data
}

@Entity()
export class CredentialVerifyRequest implements CredentialRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  callbackUrl: string;

  @ManyToOne(
    () => CredentialType,
    type => type.verifyRequests,
    {
      eager: true,
    },
  )
  type: CredentialType;

  @Column()
  @Generated('uuid')
  uuid: string;

  @ManyToOne(
    () => Organization,
    organization => organization.verifyRequests,
    {
      eager: true,
    },
  )
  requestor: Organization;

  static requestType: string;

  get requestId() {
    return `${CredentialVerifyRequest.requestType}:${this.uuid}`;
  }

  get iss() {
    return this.requestor?.uuid;
  }

  get verifier() {
    return this.requestor;
  }

  set verifier(verifier: Organization) {
    this.requestor = verifier;
  }
}

// This was moved outside the class definition, because TypeScript didn't emit
// the property into JS.
CredentialVerifyRequest.requestType = 'credential-verify-request';
