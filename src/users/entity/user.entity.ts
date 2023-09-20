import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserGame } from '../../user-game/entity/user-game.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  username: string;

  @Column({
    name: 'email_address',
    nullable: false,
    default: '',
  })
  email: string;

  @Column({
    nullable: true,
    default: '',
  })
  password: string;

  @OneToMany(() => UserGame, ({ user }) => user)
  games: UserGame[];
}
