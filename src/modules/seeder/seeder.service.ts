import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AUTHS_MODEL, AuthsDocument } from 'modules/auth/schemas/auths.schema';
import { PaginateModel } from 'mongoose';
import { accountAdmin, accountSuperAdmin } from './data';
import * as bcrypt from "bcrypt";

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectModel(AUTHS_MODEL)
    private readonly authsModel: PaginateModel<AuthsDocument>,
  ) {}

  async onModuleInit() {
    console.log(`======= Starting seed data =======`);
    await this.initDataAccountAdmin();
    await this.initDataAccountSuperAdmin();
    console.log("======= End seed data =======");
  }

  async initDataAccountAdmin() {
    const findAccount = await this.authsModel.findOne({ phone: accountAdmin.phone });

    if (!findAccount) {
      const hashPassWord = await bcrypt.hash(accountAdmin.password, 14);
      await this.authsModel.create({ ...accountAdmin, password: hashPassWord });
      console.log('======= Create ADMIN =======')
    }
  }

  async initDataAccountSuperAdmin() {
    const findAccount = await this.authsModel.findOne({ phone: accountSuperAdmin.phone });

    if (!findAccount) {
      const hashPassWord = await bcrypt.hash(accountSuperAdmin.password, 14);
      await this.authsModel.create({ ...accountSuperAdmin, password: hashPassWord });
      console.log('======= Create SUPER ADMIN =======')
    }
  }
}
