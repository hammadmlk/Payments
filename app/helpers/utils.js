import { usersDucksExpirationLength, userExpirationLength, repliesExpirationLength } from 'config/constants'

export function formatTransaction (isOutbound, amount, title, recievedByPersonId, paidByPersonId, comments) {
  return {
    isOutbound,
    amount,
    title,
    recievedByPersonId,
    paidByPersonId,
    comments,
    timestamp: Date.now(),
  }
}

export function formatPerson (name, role) {
  return {
    name,
    role,
  }
}

export function formatProject (name, status) {
  return {
    name,
    status,
  }
}
