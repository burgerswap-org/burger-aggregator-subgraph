import { Swap } from '../generated/BurgerAggregator/BurgerAggregator'
import { RewardAmountEntity, RewardInfoEntity } from '../generated/schema'
import { convertTokenToDecimal, BD_18, BI_18 } from '../comn/helper'
import { BigInt, log, BigDecimal } from '@graphprotocol/graph-ts'
import { 
    ZERO_ADDRESS, BUSD_ADDRESS, USDT_ADDRESS, USDC_ADDRESS, DAI_ADDRESS, CAKE_ADDRESS, ETH_ADDRESS, BTC_ADDRESS, BURGER_ADDRESS,
    ZERO_RATE, BUSD_RATE, USDT_RATE, USDC_RATE, DAI_RATE, CAKE_RATE, ETH_RATE, BTC_RATE, BURGER_RATE
} from '../comn/const'

export function handleSwap(event: Swap): void {
    let flag = false;
    let rate = BD_18
    if (event.params.destToken.toHex() == ZERO_ADDRESS) {
        rate = ZERO_RATE
        flag = true;
    } else if (event.params.destToken.toHex() == BUSD_ADDRESS) {
        rate = BUSD_RATE
        flag = true;
    } else if (event.params.destToken.toHex() == USDT_ADDRESS) {
        rate = USDT_RATE
        flag = true;
    } else if (event.params.destToken.toHex() == USDC_ADDRESS) {
        rate = USDC_RATE
        flag = true;
    } else if (event.params.destToken.toHex() == DAI_ADDRESS) {
        rate = DAI_RATE
        flag = true;
    } else if (event.params.destToken.toHex() == CAKE_ADDRESS) {
        rate = CAKE_RATE
        flag = true;
    } else if (event.params.destToken.toHex() == ETH_ADDRESS) {
        rate = ETH_RATE
        flag = true;
    } else if (event.params.destToken.toHex() == BTC_ADDRESS) {
        rate = BTC_RATE
        flag = true;
    } else if (event.params.destToken.toHex() == BURGER_ADDRESS) {
        rate = BURGER_RATE
        flag = true;
    }
    if (!flag) return
    let rewardAmount = convertTokenToDecimal(event.params.returnAmount, BI_18)
    rewardAmount = rewardAmount.times(rate).div(BD_18)
    let entity = RewardAmountEntity.load(event.params.swaper.toHex())
    if (entity == null) {
        entity = new RewardAmountEntity(event.params.swaper.toHex())
        entity.blockNumber = event.block.number
        entity.timestamp = event.block.timestamp
        entity.rewardAmount = rewardAmount
        entity.save()
        return
    }
    entity.blockNumber = event.block.number
    entity.timestamp = event.block.timestamp
    entity.rewardAmount = entity.rewardAmount.plus(rewardAmount)

    let infoEntity = RewardInfoEntity.load(event.address.toHex())
    if (infoEntity == null) {
        infoEntity = new RewardInfoEntity(event.address.toHex())
        infoEntity.blockNumber = event.block.number
        infoEntity.timestamp = event.block.timestamp
        infoEntity.totalAmount = rewardAmount
        infoEntity.save()
        return
    }
    infoEntity.blockNumber = event.block.number
    infoEntity.timestamp = event.block.timestamp
    infoEntity.totalAmount = infoEntity.totalAmount.plus(rewardAmount)

    entity.save()
    infoEntity.save()
    return
}