import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum FriendStatus {
    Invited = 'invited',
    Pending = 'pending',
    Friended = 'friended',
    Blocked = 'blocked',
}

@Entity()
export class Friend {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sender_id' })
    sender: User;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiver_id' })
    receiver: User;

    // @ManyToOne(() => User, user => user.sentFriendRequest)
    // @JoinTable({ name: 'friend_sender' })
    // sender: User;

    // @ManyToMany(() => User, user => user.receiveFriendRequest)
    // @JoinTable({ name: 'friend_receiver' })
    // receiver: User;

    @Column({ type: 'enum', enum: FriendStatus})
    status: FriendStatus;
}