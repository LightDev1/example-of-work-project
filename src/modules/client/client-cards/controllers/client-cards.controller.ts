import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApplePassService } from 'src/modules/cards/passes/apple/apple-pass.service';
import { ClientGooglePassService } from 'src/modules/cards/passes/google/client-google-pass.service';
import { ClientCard } from 'src/modules/client-cards/models/client-card.entity';
import { ClientCardsService } from 'src/modules/client-cards/services/client-cards.service';
import AppFile from 'src/modules/core/files/models/file.entity';
import { GetGooglePassLinkDto } from '../dto/GetGooglePasLinkDto';

@Controller('client/client-cards')
@ApiTags('Client Client Cards')
export class ClientClientCardsController {
  constructor(
    private readonly service: ClientCardsService,
    private readonly applePassService: ApplePassService,
    private readonly clientGooglePassService: ClientGooglePassService,
  ) {}

  @ApiResponse({ type: () => ClientCard })
  @Post()
  public createClientCard(@Body() data: ClientCard): Promise<ClientCard> {
    return this.service.create(data);
  }

  @ApiResponse({ type: () => AppFile })
  @Get(':cardId/apple-wallet-card/:clientCardId')
  public getApplePassFile(
    @Param('cardId') cardId: string,
    @Param('clientCardId') clientCardId: string,
  ): Promise<AppFile> {
    return this.applePassService.createPass(clientCardId, cardId);
  }

  @ApiResponse({ type: () => GetGooglePassLinkDto })
  @Get(':cardId/google-wallet-card/:clientCardId')
  public getGooglePassLink(
    @Param('cardId') cardId: string,
    @Param('clientCardId') clientCardId: string,
  ): Promise<GetGooglePassLinkDto> {
    return this.clientGooglePassService.createPass(clientCardId, cardId);
  }
}
