defmodule Katalyst.Repo do
  use Ecto.Repo,
    otp_app: :katalyst,
    adapter: Ecto.Adapters.Postgres
end
