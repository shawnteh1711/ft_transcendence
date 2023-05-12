import { MatchHistoryService } from '../services/match-history.service';
import { CreateMatchHistoryDto } from '../dto/create-match-history.dto';
import { MatchHistory } from 'src/typeorm/match_history.entity';
export declare class MatchHistoryController {
    private readonly matchHistoryService;
    constructor(matchHistoryService: MatchHistoryService);
    getHistory(): Promise<MatchHistory[]>;
    getByMatchUid(uid: string): Promise<MatchHistory[]>;
    getByPlayerUid(uid: string): Promise<MatchHistory[]>;
    getByScore(score: string): Promise<MatchHistory[]>;
    create(createMatchHistoryDto: CreateMatchHistoryDto): Promise<void>;
    remove(uid: string): Promise<{
        message: string;
    }>;
}
