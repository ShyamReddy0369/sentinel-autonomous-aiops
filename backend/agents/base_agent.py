"""
Base class for all Sentinel AI agents.
"""

from abc import ABC, abstractmethod
from typing import Any


class BaseAgent(ABC):
    """
    Every AI agent in Sentinel inherits from this class.
    """

    def __init__(self, name: str) -> None:
        self.name: str = name

    @abstractmethod
    def run(self, context: Any) -> Any:
        """
        Execute the agent.
        """
        pass
