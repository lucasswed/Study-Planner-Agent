from pydantic import BaseModel, Field, model_validator


class RegisterRequest(BaseModel):
    username: str = Field(min_length=4)
    password: str = Field(min_length=8)
    confirm_password: str = Field(min_length=8)

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("password and confirm_password must match")
        return self


class LoginRequest(BaseModel):
    username: str = Field(min_length=4)
    password: str = Field(min_length=8)


class TokenResponse(BaseModel):
    token: str
