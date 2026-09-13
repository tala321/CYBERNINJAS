@router.post("/", response_model=ChallengeAttemptResponse)
def create_attempt(
    data: ChallengeAttemptCreate,
    db: Session = Depends(get_db)
):


    option = db.query(
        ChallengeOption
    ).filter(
        ChallengeOption.id ==
        data.selected_option_id
    ).first()



    if not option:
        raise HTTPException(
            status_code=404,
            detail="Option not found"
        )



    is_correct = option.is_correct



    challenge = db.query(
        Challenge
    ).filter(
        Challenge.id ==
        data.challenge_id
    ).first()



    if not challenge:
        raise HTTPException(
            status_code=404,
            detail="Challenge not found"
        )



    xp = 0

    if is_correct:
        xp = challenge.xp_reward



    attempt = ChallengeAttempt(

        user_id=data.user_id,

        challenge_id=data.challenge_id,

        selected_option_id=data.selected_option_id,

        is_correct=is_correct,

        xp_earned=xp

    )



    db.add(attempt)



    # XP Transaction

    if xp > 0:

        transaction = XPTransaction(

            user_id=data.user_id,

            amount=xp,

            source_type="challenge",

            source_id=challenge.id,

            description_en="Completed challenge"

        )

        db.add(transaction)



    db.commit()

    db.refresh(attempt)



    return attempt